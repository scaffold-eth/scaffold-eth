/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { EtherInput, Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";

export default function ExampleUI({depositEvents, withdrawEvents, streamBalance, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const [amount, setAmount] = useState();

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>

        <h4>stream balance: {streamBalance && formatEther(streamBalance)}</h4>

        <Divider/>

        <div style={{margin:8}}>
        <EtherInput
          autofocus
          price={price}
          value={amount}
          placeholder="Enter amount"
          onChange={value => {
            setAmount(value);
          }}
        />
          <Button onClick={()=>{
            //console.log("newPurpose",newPurpose)
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.SimpleStream.streamWithdraw(parseEther(""+amount),"no reason yet") )
          }}>Withdraw</Button>
        </div>

      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>withdrawEvents:</h2>
        <List
          bordered
          dataSource={withdrawEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.to}>
                <Address
                    address={item.to}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> =>
                {item.reason}
                {formatEther(item.amount)}
              </List.Item>
            )
          }}
        />
      </div>

      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>depositEvents:</h2>
        <List
          bordered
          dataSource={depositEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.from}>
                <Address
                    address={item.from}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> =>
                {item.reason}
                {formatEther(item.amount)}
              </List.Item>
            )
          }}
        />
      </div>


    </div>
  );
}
