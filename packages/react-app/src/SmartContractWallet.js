import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Typography, Skeleton, Card, Row, Col, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

import { useContractLoader, useContractReader } from "./hooks"
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
             writeContracts['SmartContractWallet'].updateOwner(newOwner)
          )
        }}/></Col>
      </Row>
    )
    onDeposit = ()=>{
      tx({
        to: readContracts[contractName].address,
        value: ethers.utils.parseEther('0.001'),
      })
    }
    onWithdraw = ()=>{
      tx(
        writeContracts['SmartContractWallet'].withdraw()
      )
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
