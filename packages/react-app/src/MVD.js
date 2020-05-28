import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Input, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline } from "./components"
const { Meta } = Card;

const contractName = "MVD"

export default function MVD(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const writeContracts = useContractLoader(props.injectedProvider);

  const contractAddress = props.readContracts?props.readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)

/*
  const title = useContractReader(readContracts,contractName,"title",1777);
  const owner = useContractReader(readContracts,contractName,"owner",1777);

  const ownerUpdates = useEventListener(readContracts,contractName,"UpdateOwner",props.localProvider,1);//set that last number to the block the contract is deployed (this needs to be automatic in the contract loader!?!)

  let displayAddress, displayOwner

  if(readContracts && readContracts[contractName]){
    displayAddress = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Deployed to:</Col>
        <Col span={16}><Address value={contractAddress} /></Col>
      </Row>
    )
    displayOwner = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Owner:</Col>
        <Col span={16}><Address value={owner} onChange={(newOwner)=>{
          tx(
             writeContracts['SmartContractWallet'].updateOwner(newOwner,
               { gasLimit: ethers.utils.hexlify(40000) }
             )
          )
        }}/></Col>
      </Row>
    )
  }
*/


  const [initTokens, setInitTokens] = useState()
  const [initETH, setInitETH] = useState()

  let display = []

  if(props.readContracts && props.readContracts[contractName]){

/*
    display.push(
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Allowance:</Col>
        <Col span={16}>
          {allowance?ethers.utils.formatUnits(allowance,"ether"):0}
        </Col>
      </Row>
    )


    display.push(
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Approve:</Col>
        <Col span={12}>
          <Input
            size="large"
            placeholder="tokens"
            value={approveTokens}
            onChange={(e)=>{
              setApproveTokens(e.target.value)
            }}
          />
        </Col>
        <Col span={4}>
          <Button onClick={()=>{
            console.log("writeContracts",writeContracts)
            tx(
              writeContracts["Balloons"].approve(
                contractAddress,
                ethers.utils.parseEther(approveTokens)
              )
            )
            setApproveTokens("")
          }} shape="circle" icon={"👍"} />
        </Col>
      </Row>
    )


    display.push(
      <Row>
        <Col span={4} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Init:</Col>
        <Col span={8}>
          <Input
            size="large"
            placeholder="tokens"
            value={initTokens}
            onChange={(e)=>{
              setInitTokens(e.target.value)
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            size="large"
            placeholder="ETH"
            value={initETH}
            onChange={(e)=>{
              setInitETH(e.target.value)
            }}
          />
        </Col>
        <Col span={4}>
          <Button onClick={()=>{
            console.log("writeContracts",writeContracts)
            tx(
              writeContracts[contractName].init(
                ethers.utils.parseEther(initTokens),
                {value: ethers.utils.parseEther(initETH)}
              )
            )
          }} shape="circle" icon={<DownloadOutlined />} />
        </Col>
      </Row>
    )*/
  }

  return (
    <div>
      <Card
        title={(
          <div>
            MVD
            <div style={{float:'right'}}>
              <Address value={contractAddress} />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={false}>
        { display }
      </Card>

    </div>
  );

}
