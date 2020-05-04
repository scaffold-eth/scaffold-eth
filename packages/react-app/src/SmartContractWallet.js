import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Typography, Skeleton, Card, Row, Col, Button, List } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline } from "./components"
const { Title } = Typography;
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

  let displayOwner, onDeposit, onWithdraw

  if(readContracts && readContracts[contractName]){
    displayOwner = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Owner:</Col>
        <Col span={16}>
          <Address value={owner}/>
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
                {displayOwner}
              </div>
            )}
          />
      </Card>
      <div style={{position:'fixed',textAlign:'right',right:25,top:90,padding:10,width:"50%"}}>
        <h1>✅ TODO LIST</h1>
        <Timeline
          localProvider={props.localProvider}
          address={props.address}
          chainIsUp={typeof localBlockNumber != "undefined"}
          hasOwner={typeof owner != "undefined"}

          hasEther={parseFloat(localBalance)>0}
          contractAddress={contractAddress}
          contractHasEther={parseFloat(contractBalance)>0}
          amOwnerOfContract={owner===props.address}
        />
      </div>
    </div>
  );

}
