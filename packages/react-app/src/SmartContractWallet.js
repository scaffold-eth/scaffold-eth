import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Typography, Skeleton, Card, Row, Col, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractReader } from './hooks'
import { Address, Balance } from "./components"
const { Title } = Typography;
const { Meta } = Card;

const contractName = "SmartContractWallet"

export default function SmartContractWallet(props) {

  const title = useContractReader(props.readContracts,contractName,"title",1777);
  const owner = useContractReader(props.readContracts,contractName,"owner",1777);

  let displayAddress, displayOwner, onDeposit, onWithdraw

  if(props.readContracts && props.readContracts[contractName]){
    displayAddress = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Deployed to:</Col>
        <Col span={16}><Address value={props.readContracts[contractName].address} /></Col>
      </Row>
    )
    displayOwner = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Owner:</Col>
        <Col span={16}><Address value={owner} onChange={async (newOwner)=>{
          console.log("UPDATING OWNER ",newOwner,props.writeContracts)
          let result = await props.writeContracts['SmartContractWallet'].updateOwner(newOwner)
          console.log("result",result)
        }}/></Col>
      </Row>
    )
    onDeposit = ()=>{
      props.tx({
        to: props.readContracts[contractName].address,
        value: ethers.utils.parseEther('0.01'),
      })
    }
    onWithdraw = async ()=>{

      let result = await props.writeContracts['SmartContractWallet'].withdraw()
      console.log("result",result)
    }
  }


  return (
    <div>
      <Card
        title={(
          <div>
            {title}
            <div style={{float:'right',opacity:title?0.77:0.33}}>
              <Balance
                address={props.readContracts?props.readContracts[contractName].address:0}
                provider={props.injectedProvider}
                dollarMultiplier={props.dollarMultiplier}
              />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!title}
        actions={[
            <div onClick={onWithdraw}>
              <UploadOutlined /> Withdraw
            </div>,
            <div onClick={onDeposit}>
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
    </div>
  );

}
