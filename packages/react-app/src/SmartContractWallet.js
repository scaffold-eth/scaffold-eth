import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Typography, Skeleton, Card, Row, Col, Button, List } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance } from "./components"
const { Title } = Typography;
const { Meta } = Card;

const contractName = "SmartContractWallet"

export default function SmartContractWallet(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);

  const title = useContractReader(readContracts,contractName,"title",1777);
  const owner = useContractReader(readContracts,contractName,"owner",1777);

  const ownerUpdates = useEventListener(readContracts,contractName,"UpdateOwner",props.localProvider,1);//set that last number to the block the contract is deployed (this needs to be automatic in the contract loader!?!)

  console.log("ownerUpdates",ownerUpdates)

  let displayAddress, displayOwner, onDeposit, onWithdraw

  if(readContracts && readContracts[contractName]){
    displayAddress = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Deployed to:</Col>
        <Col span={16}><Address value={readContracts[contractName].address} /></Col>
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

  return (
    <div>
      <Card
        title={(
          <div>
            {title}
            <div style={{float:'right',opacity:title?0.77:0.33}}>
              <Balance
                address={readContracts?readContracts[contractName].address:0}
                provider={props.localProvider}
                dollarMultiplier={props.price}
              />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!title}
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
                to: readContracts[contractName].address,
                value: ethers.utils.parseEther('0.001'),
              })
            }}>
              <DownloadOutlined /> Deposit
            </div>,
        ]}>
          <Meta
            description={(
              <div>
                {displayAddress}
                {displayOwner}
              </div>
            )}
          />
      </Card>
      <List
        style={{ width: 550, marginTop: 25}}
        header={<div><b>UpdateOwner</b> events</div>}
        bordered
        dataSource={ownerUpdates}
        renderItem={item => (
          <List.Item style={{ fontSize:22 }}>
            <Blockies seed={item.oldOwner.toLowerCase()} size={8} scale={2}/> transferred ownership to <Blockies seed={item.newOwner.toLowerCase()} size={8} scale={2}/>
          </List.Item>
        )}
      />
    </div>
  );

}
