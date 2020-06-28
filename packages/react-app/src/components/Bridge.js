import React, { useState, useEffect } from 'react'
import { LinkOutlined, DownOutlined, UpOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Row, Col, Button, Popover } from 'antd';
import { ethers } from "ethers";
import { AmountInput } from "."

export default function Bridge(props) {


  let moonToxMoonBridge, max
  const [mode, setMode] = useState();
  const [amount, setAmount] = useState();

  const update = (newMode,newAmount)=>{
    setMode(newMode)
    setAmount(newAmount)
    if(typeof props.onUpdate == "function"){
      props.onUpdate(newMode,newAmount)
    }
  }

  let upDisplay = ""
  let downDisplay = ""
  if(props.dexMode){
    upDisplay = (
      <div>{props.upText} <RightOutlined /></div>
    )
    downDisplay = (
      <div><LeftOutlined /> {props.downText} </div>
    )
  }else{
    upDisplay = (
      <div><UpOutlined /> {props.upText}</div>
    )
    downDisplay = (
      <div><DownOutlined /> {props.downText}</div>
    )
  }


  if (!mode) {
    return (
      <Row gutter={8}>

        <Col span={12} align="right">
          {props.upDisabled ? (
            <Popover content={props.bottomNetwork?"Required Network: "+props.bottomNetwork:"Wrong Network Selected"}>
              <Button shape="round" size="large" type="primary" onClick={() => { update("up",amount) }} disabled={true}  >
                {upDisplay}
              </Button>
            </Popover>
          ):(
            <Button shape="round" size="large" type="primary" onClick={() => { update("up",amount) }} disabled={false}  >
              {upDisplay}
            </Button>
          )}

        </Col>
        <Col span={12} align="left">
          {props.downDisabled ? (
            <Popover content={props.topNetwork?"Required Network: "+props.topNetwork:"Wrong Network Selected"}>
              <Button shape="round" size="large" type="primary" onClick={() => { update("down",amount) }} disabled={true}  >
                {downDisplay}
              </Button>
            </Popover>
          ):(
            <Button shape="round" size="large" type="primary" onClick={() => { update("down",amount) }} disabled={false}  >
              {downDisplay}
            </Button>
          )}
        </Col>
      </Row>
    )
  } else {
    let button
    if (mode == "down") {
     max = props.topBalance ? ethers.utils.formatEther(props.topBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={()=>{props.transferDown(amount)}} disabled={!amount}>
          {downDisplay}
        </Button>
      )
    } else {
      max = props.bottomBalance ? ethers.utils.formatEther(props.bottomBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={()=>{props.transferUp(amount)}} disabled={!amount}>
          {upDisplay}
        </Button>
      )
    }

    return (
      <Row gutter={8}>
        <Col span={10} align="center">
          <AmountInput prefix="" max={max} value={amount} setValue={(value)=>{
            update(mode,value)
          }} />
        </Col>
        <Col span={8} align="center">
          {button}
        </Col>
        <Col span={6} align="center">
          <Button shape="round" size="large" onClick={() => { update("",0) }}>
            cancel
        </Button>
        </Col>
      </Row>
    )
  }
}
