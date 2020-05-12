import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Typography, Slider, Divider, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline, Dollars } from "./components"

const { Title, Text } = Typography;
const { Meta } = Card;
const contractName = "SmartContractWallet"

export default function SmartContractWallet(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);

  const owner = useContractReader(readContracts,contractName,"owner",1777);

  const contractAddress = readContracts?readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)

  const myMode = useContractReader(readContracts,contractName,"mode",null,1777,(unformatted)=>{
    if(unformatted){
      return ethers.utils.parseBytes32String(unformatted)
    }
    return unformatted
  })

  const [ stabilityPreference, setStabilityPreference ] = useState()
  const ourStabilityPreference = useContractReader(readContracts,contractName,"stabilityPreference",null,1777,null,()=>{
    if(ourStabilityPreference != stabilityPreference){
      setStabilityPreference(ourStabilityPreference)
    }
  })

  const myBalance = useContractReader(readContracts,contractName,"balances",[props.address],1777)
  const isOverThreshold = useContractReader(readContracts,contractName,"isOverThreshold",2777)

  let display = []

  function formatter(value) {
    return `${value}%`;
  }

  let stabilityPreferenceDisplay = (
    <span>
      {ourStabilityPreference}%
    </span>
  )

  const stabilityUpdated = typeof stabilityPreference != "undefined"

  if( stabilityUpdated && ourStabilityPreference != stabilityPreference){
    stabilityPreferenceDisplay = (
      <span>
        {ourStabilityPreference}% => {stabilityPreference}%
      </span>
    )
  }

  if(readContracts && readContracts[contractName]){
    display.push(
      <Row key="ownerRow">
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Owner:</Col>
        <Col span={16}>
          <Address value={owner}/>
        </Col>
      </Row>
    )
    display.push(
      <Row key="modeRow">
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Mode:</Col>
        <Col span={12}>
          <Title level={3} code>{myMode}</Title>
        </Col>
        <Col span={4}>
          <Button shape="round" type={isOverThreshold?"primary":"dashed"} disabled={!isOverThreshold} onClick={()=>{
            tx(
              writeContracts['SmartContractWallet'].updateMode(
                { gasLimit: ethers.utils.hexlify(80000) }
              )
            )
          }}>
            ✅
          </Button>
        </Col>
      </Row>
    )

    let percentContribution = Math.round((parseFloat(myBalance) / parseFloat(contractBalance)) * 100);

    display.push(
      <Row key="dividerThing1">
        <Col span={24}>
          <Divider orientation="left" plain>
            Your Contribution ({percentContribution?percentContribution:"0"}%)
          </Divider>
        </Col>
      </Row>
    )

    display.push(
      <Row key="myBalance">
        <Col span={8} style={{textAlign:"right",paddingRight:6,fontSize:24}}>
          <Address minimized={true} value={props.address}/>
        </Col>
        <Col span={16}>
          <Balance
            balance={myBalance}
            dollarMultiplier={props.price}
          />
        </Col>
      </Row>
    )
    display.push(
      <Row key="dividerThing2">
        <Col span={24}>
          <Divider orientation="left" plain>
            Stability Preference ({stabilityPreferenceDisplay})
          </Divider>
        </Col>
      </Row>
    )
    display.push(
      <Row key="myStability">
        <Col span={24}>
          <Slider value={stabilityUpdated?stabilityPreference:ourStabilityPreference} tipFormatter={formatter}
            onAfterChange={async (value)=>{
              console.log("MAKE TRANSACTION TO SET stabilityPreference to ",stabilityPreference)
              let txResult = await tx(
                writeContracts['SmartContractWallet'].setPreference(
                  stabilityPreference,
                  { gasLimit: ethers.utils.hexlify(80000) }
                )
              )
            }}
            onChange={(value)=>{
              setStabilityPreference(value)
            }}
          />
        </Col>
      </Row>
    )
  }

  return (
    <div>
      <Card
        title={(
          <div>
            <Balance
              address={contractAddress}
              provider={props.localProvider}
              dollarMultiplier={props.price}
            />
            <div style={{float:'right',opacity:0.77}}>
              <Address value={contractAddress} />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!owner}
        actions={[
            <div onClick={()=>{
              tx(
                writeContracts['SmartContractWallet'].withdraw(
                  { gasLimit: ethers.utils.hexlify(40000) }
                )
              )
            }}>
              <UploadOutlined /> Withdraw
            </div>,
            <div onClick={()=>{
              tx({
                to: contractAddress,
                value: ethers.utils.parseEther('0.001'),
              })
            }}>
              <DownloadOutlined /> Deposit
            </div>,
        ]}>
          <Meta
            description={(
              <div>
                {display}
              </div>
            )}
          />
      </Card>
      <div style={{position:'fixed',textAlign:'right',right:25,top:90,padding:10,width:"50%"}}>
        <h1><span role="img" aria-label="checkmark">✅</span> TODO LIST</h1>
        <Timeline
          localProvider={props.localProvider}
          address={props.address}
          chainIsUp={typeof localBlockNumber != "undefined"}
          hasOwner={typeof owner != "undefined"}

          hasEther={parseFloat(localBalance)>0}
          contractAddress={contractAddress}
          contractHasEther={contractBalance>0}
          amOwnerOfContract={owner===props.address}
        />
      </div>
    </div>
  );

}
