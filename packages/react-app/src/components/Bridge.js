import React, { useState, useEffect } from 'react'
import { LinkOutlined, DownOutlined, UpOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Row, Col, Button, Popover, Progress } from 'antd';
import { ethers } from "ethers";
import { AmountInput } from "."

export default function Bridge(props) {


  let moonToxMoonBridge, max
  const [mode, setMode] = useState();
  const [amount, setAmount] = useState();
  const [start, setStart] = useState();


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
      <div><LeftOutlined /> {props.upText}</div>
    )
    downDisplay = (
      <div> {props.downText}  <RightOutlined /></div>
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
    if (mode == "bridgingDown" || mode == "bridgingUp" ) {

      let timePassed = Date.now()-start

      let percent = timePassed/5000*100

      return (
        <Row gutter={8} type="flex" align="middle" style={{backgroundColor:"#FFFFFF", padding:32, borderRadius:8}}>
          <Col span={8} align="right" >
            <Progress type="circle" percent={Math.round(Math.min(100,percent))} width={80} />
          </Col>
          <Col span={8} align="center">
            {mode == "bridgingDown" ? downDisplay:upDisplay}
          </Col>
          <Col span={8} align="left">

          </Col>
        </Row>
      )
    } else if (mode == "confirmDialog") {
      return (
        <Row gutter={8} type="flex" align="middle" style={{backgroundColor:"#FFFFFF", padding:32, borderRadius:8}}>
          <Col span={24} align="center" >
            <img src="./metamask.png" style={{maxWidth:64, paddingRight:16}} /> Please confirm wallet dialog.
          </Col>
        </Row>
      )
    } else if (mode == "down") {
     max = props.topBalance ? ethers.utils.formatEther(props.topBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={async ()=>{
          console.log("AWAITING TRANSFER DOWN")
          update("confirmDialog",amount)
          let result = await props.transferDown(amount)
          update("",0)
          //setStart(Date.now())
          //console.log("TRANSFER DOWN RESULOT:",result)
          //setTimeout(()=>{
          //  update("",0)
          //},15000)
        }} disabled={!amount}>
          {downDisplay}
        </Button>
      )
    } else if (mode == "up") {
      max = props.bottomBalance ? ethers.utils.formatEther(props.bottomBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={async ()=>{
          console.log("AWAITING TRANSFER UP")
          update("confirmDialog",amount)
          let result = await props.transferUp(amount)
          update("",0)
        }} disabled={!amount}>
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
