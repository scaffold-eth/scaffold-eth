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

  const purpose = useContractReader(props.contracts,name,"purpose",1777);
  const owner = useContractReader(props.contracts,name,"owner",1777);

  let displayAddress
  let displayOwner
  let onDeposit
  if(props.contracts && props.contracts[name]){
    displayAddress = (
      <Row>
        <Col span={8}>Address:</Col>
        <Col span={16}><Address value={props.contracts[name].address} /></Col>
      </Row>
    )
    displayOwner = (
      <Row>
        <Col span={8}>Owner:</Col>
        <Col span={16}><Address value={owner} /></Col>
      </Row>
    )
    onDeposit = ()=>{
      props.tx({
        to: props.contracts[name].address,
        value: ethers.utils.parseEther('0.01'),
      })
    }
  }



  return (
    <div style={{padding:10,textAlign:'left'}}>
      <Card
        size="large"
        style={{ width: 450, marginTop: 25 }}
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
