import React, { useState, useEffect } from "react";
import { message, Row, Col, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { QRPunkBlockie, QRBlockie, EtherInput, Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import pretty from 'pretty-time';

export default function ExampleUI({streamToAddress, streamfrequency, totalStreamBalance, streamCap, depositEvents, withdrawEvents, streamBalance, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const [amount, setAmount] = useState();
  const [reason, setReason] = useState();

  const [ depositAmount, setDepositAmount ] = useState();
  const [ depositReason, setDepositReason ] = useState();

  console.log("streamCap",streamCap)
  console.log("streamBalance",streamBalance)
  const percent = streamCap && streamBalance && (streamBalance.mul(100).div(streamCap)).toNumber()

  console.log("percent",percent )

  let streamNetPercentSeconds = totalStreamBalance && streamCap&& totalStreamBalance.mul(100).div(streamCap)

  console.log("streamNetPercentSeconds",streamNetPercentSeconds,streamNetPercentSeconds&&streamNetPercentSeconds.toNumber())

  const totalSeconds = streamNetPercentSeconds && streamfrequency && streamNetPercentSeconds.mul(streamfrequency)
  console.log("totalSeconds",totalSeconds)

  const numberOfTimesFull = streamNetPercentSeconds && Math.floor(streamNetPercentSeconds.div(100))

  const streamNetPercent = streamNetPercentSeconds && streamNetPercentSeconds.mod(100)
  console.log("streamNetPercent",streamNetPercent, streamNetPercent && streamNetPercent.toNumber())

  const remainder = streamNetPercent && streamNetPercent.mod(1);
  console.log("remainder",remainder,remainder&&remainder.toNumber())

  const totalUnclaimable = totalStreamBalance && streamBalance && totalStreamBalance.sub(streamBalance)

  //const unclaimedPercent = totalStreamBalance && totalUnclaimable && totalUnclaimable.mul(100).div(totalStreamBalance)
  //console.log("unclaimedPercent",unclaimedPercent,unclaimedPercent&&unclaimedPercent.toNumber())

  const WIDTH = "calc(min(77vw,620px))"

  let totalProgress = []

  const widthOfStacks = numberOfTimesFull > 6 ? 32 : 64

  for(let c=0;c<numberOfTimesFull;c++){
    totalProgress.push(
      <Progress percent={100} showInfo={false} style={{width:widthOfStacks,padding:4}}/>
    )
  }
  if(streamNetPercent && streamNetPercent.toNumber()>0){
    totalProgress.push(
      <Progress percent={streamNetPercent&&streamNetPercent.toNumber()} showInfo={false} status="active" style={{width:widthOfStacks,padding:4}}/>
    )
  }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:


          //<QRBlockie scale={0.6} withQr={true} address={readContracts && readContracts.SimpleStream.address} />


      */}

      <div style={{padding:16, width:WIDTH, margin:"auto"}}>
        <div style={{padding:32}}>
          <div style={{padding:32}}>
            <Balance address={readContracts.SimpleStream && readContracts.SimpleStream && readContracts.SimpleStream.address} provider={localProvider} price={price}/>
            <span style={{opacity:0.5}}> @ <Balance value={streamCap} price={price}/> / {streamfrequency&&pretty(streamfrequency.toNumber()*1000000000)}</span>
          </div>
          <div>
            {totalProgress} ({totalSeconds&&pretty(totalSeconds.toNumber()*10000000)})
          </div>
        </div>
      </div>

      <div style={{marginTop:-32}}>
        <Address value={readContracts.SimpleStream && readContracts.SimpleStream && readContracts.SimpleStream.address} />
      </div>


      <div style={{width:400, margin:"auto", marginTop:32, position:"relative"}}>
        <div style={{padding:16, marginBottom:64}}>
          <span style={{opacity:0.5}}>streaming to:</span>
        </div>
        <div style={{position:"absolute",top:-50}}>
          <QRPunkBlockie withQr={false} address={streamToAddress} scale={0.7} />
        </div>
        <Address value={streamToAddress} ensProvider={mainnetProvider} />

      </div>



      <div style={{border:"1px solid #cccccc", padding:16, width:WIDTH, margin:"auto",marginTop:64}}>

        {/* <h4>stream balance: {streamBalance && formatEther(streamBalance)}</h4> */}

        <Progress strokeLinecap="square" type="dashboard" percent={percent} format={()=>{
          return <Balance price={price} value={streamBalance} size={18}/>
        }} />

        <Divider/>

        <div style={{margin:8}}>
          <Input
            style={{marginBottom:8}}
            value={reason}
            placeholder={"reason / work / link"}
            onChange={e => {
              setReason(e.target.value);
            }}
          />
          <EtherInput
            mode={"USD"}
            autofocus
            price={price}
            value={amount}
            placeholder="Withdraw amount"
            onChange={value => {
              setAmount(value);
            }}
          />
          <Button   style={{marginTop:8}} onClick={()=>{
            if(!reason || reason.length<6){
              message.error("Please provide a longer reason / work / length");
            }else{
              tx( writeContracts.SimpleStream.streamWithdraw(parseEther(""+amount),reason) )
              setReason();
              setAmount();
            }
          }}>Withdraw</Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width:WIDTH, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Work log:</h2>
        <List
          bordered
          dataSource={withdrawEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.args[0]}>

                <Balance
                  value={item.args[1]}
                  price={price}
                />
                <span style={{fontSize:14}}>
                  <span style={{padding:4}}>
                    {item.args[2]}
                  </span>
                  <Address
                      minimized={true}
                      address={item.args[0]}
                  />
                </span>
              </List.Item>
            );
          }}
        />
      </div>

      <div style={{ width:WIDTH, margin: "auto", marginTop:32}}>
        <h2>Deposits:</h2>
        <List
          bordered
          dataSource={depositEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.args[0]}>
                <Balance
                  value={item.args[1]}
                  price={price}
                />
                <span style={{fontSize:14}}>
                  <span style={{padding:4}}>
                    {item.args[2]}
                  </span>
                  <Address
                      minimized={true}
                      address={item.args[0]}
                  />
                </span>
              </List.Item>
            )
          }}
        />
        <hr style={{opacity:0.3333}}/>
        <Input
          style={{marginBottom:8}}
          value={depositReason}
          placeholder={"reason / guidance / north star"}
          onChange={e => {
            setDepositReason(e.target.value);
          }}
        />
        <EtherInput
          mode={"USD"}
          autofocus
          price={price}
          value={depositAmount}
          placeholder="Deposit amount"
          onChange={value => {
            setDepositAmount(value);
          }}
        />
        <Button style={{marginTop:8}} onClick={()=>{
          tx( writeContracts.SimpleStream.streamDeposit(depositReason,{
            value: parseEther(""+depositAmount)
          }) )
          setDepositReason();
          setDepositAmount();
        }}>Deposit</Button>
      </div>


      <div style={{paddingBottom:256 }}>

      </div>

    </div>
  );
}
