/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance, EtherInput } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { id } from "@ethersproject/hash";
import { keccak256 } from '@ethersproject/keccak256'
import { useContractReader, useEventListener, useNonce, useExternalContractLoader } from "../hooks";
import { LINK_ADDRESS, LINK_ABI, INFURA_ID } from "../constants";

import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export default function VrfComponent({purpose, setPurposeEvents, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts, externalContracts }) {

  const [amount, setAmount] = useState();

  // keep track of a variable from the contract in the local React state:
  const random = useContractReader(readContracts,"ChainlinkRandomNumberGenrator", "getRandomNumber")
if (random) {
  console.log(random.toString());
}
    const vrfLINKBalance = useContractReader(externalContracts, "LinkToken", "balanceOf",[writeContracts.ChainlinkRandomNumberGenrator.address])
    if (vrfLINKBalance) {
    console.log("vrfLINKBalance", vrfLINKBalance.toString())
  }


  //📟 Listen for broadcast YourContract
  const events = useEventListener(readContracts, "ChainlinkRandomNumberGenrator", "Generated", userProvider, 1);
  console.log("📟 VRF events:",events)

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
        <h2>Chainlink VRF</h2>


        <Divider/>
        <h4>VRF Contract LINK Balance:  {vrfLINKBalance && formatEther(vrfLINKBalance)}</h4>
        <br />
        <h4>Revealed Number: {random && random.toString().substring(0, 4)}</h4>
        <br />
        <h4><a href = 'https://gitter.im/kovan-testnet/faucet'>Get Kovan ETH here</a></h4>
        <br />
        <h4><a href='https://kovan.chain.link/'>Get Kovan LINK here</a></h4>
        <br />

        <div style={{margin:8}}>
        <EtherInput
  price={price}
  value={amount}
  onChange={value => {
    setAmount(value);
  }}
/> 
          <Button onClick={()=>{
            tx( externalContracts['LinkToken'].transfer(writeContracts.ChainlinkRandomNumberGenrator.address, parseEther(amount)))
          }}>Fund VRF Contract with LINK</Button>
        </div>
        <br />


        {vrfLINKBalance && parseInt(vrfLINKBalance.toString()) > 1 && <div style={{margin:8}}>
          <Button onClick={async ()=>{
            tx( writeContracts.ChainlinkRandomNumberGenrator.generateRandom(2) )
          }}>Generate Random</Button>
        </div>}

        <Divider />

        Your Address:
        <Address
            value={address}
            ensProvider={mainnetProvider}
            fontSize={16}
        />

        <Divider />

        ENS Address Example:
        <Address
          value={"0x34aA3F359A9D614239015126635CE7732c18fDF3"} /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />

        <Divider/>

        {  /* use formatEther to display a BigNumber: */ }
        <h2>Your Balance: {yourLocalBalance?formatEther(yourLocalBalance):"..."}</h2>

        OR

        <Balance
          address={address}
          provider={localProvider}
          dollarMultiplier={price}
        />

        <Divider/>


        {  /* use formatEther to display a BigNumber: */ }
        <h2>Your Balance: {yourLocalBalance?formatEther(yourLocalBalance):"..."}</h2>

        <Divider/>



        Your Contract Address:
        <Address
            value={readContracts?readContracts.YourContract.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        />

        <Divider />

      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>VRF Events:</h2>
        <List
          bordered
          dataSource={events}
          renderItem={(item) => {
            return (
              <List.Item>
                {item[0].toString().substring(0,4)}
              </List.Item>
            )
          }}
        />
      </div>

      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:256 }}>

        <Card>

          Check out all the <a href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components" target="_blank" rel="noopener noreferrer">📦  components</a>

        </Card>

        <Card style={{marginTop:32}}>

          <div>
            There are tons of generic components included from <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">🐜  ant.design</a> too!
          </div>

          <div style={{marginTop:8}}>
            <Button type="primary">
              Buttons
            </Button>
          </div>

          <div style={{marginTop:8}}>
            <SyncOutlined spin />  Icons
          </div>

          <div style={{marginTop:8}}>
            Date Pickers?
            <div style={{marginTop:2}}>
              <DatePicker onChange={()=>{}}/>
            </div>
          </div>

          <div style={{marginTop:32}}>
            <Slider range defaultValue={[20, 50]} onChange={()=>{}}/>
          </div>

          <div style={{marginTop:32}}>
            <Switch defaultChecked onChange={()=>{}} />
          </div>

          <div style={{marginTop:32}}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{marginTop:32}}>
            <Spin />
          </div>


        </Card>




      </div>


    </div>
  );
}
