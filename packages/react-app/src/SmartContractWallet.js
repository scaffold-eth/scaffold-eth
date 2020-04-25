import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Typography, Skeleton, Card, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import useContractReader from './ContractReader.js'

import Address from "./Address.js"

const { Title } = Typography;
const { Meta } = Card;

const name = "SmartContractWallet"

export default function SmartContractWallet(props) {

  const purpose = useContractReader(props.readContracts,name,"purpose",1777);
  const owner = useContractReader(props.readContracts,name,"owner",1777);



  let displayAddress
  let displayOwner
  let onDeposit
  if(props.readContracts && props.readContracts[name]){
    displayAddress = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Deployed to:</Col>
        <Col span={16}><Address value={props.readContracts[name].address} /></Col>
      </Row>
    )
    displayOwner = (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Owner:</Col>
        <Col span={16}><Address value={owner} onChange={(newOwner)=>{
          let result = props.writeContracts['SmartContractWallet'].updateOwner(newOwner)
          console.log("result",result)
        }}/></Col>
      </Row>
    )
    onDeposit = ()=>{
      props.tx({
        to: props.readContracts[name].address,
        value: ethers.utils.parseEther('0.01'),
      })
    }
  }


  return (
    <div style={{padding:10,textAlign:'left'}}>
      <Card
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!purpose}
        actions={[
            <div onClick={onDeposit}>
              <DownloadOutlined /> Deposit
            </div>,
        ]}>
          <Meta
            title={purpose}
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
