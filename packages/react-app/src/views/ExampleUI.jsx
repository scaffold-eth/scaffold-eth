/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { id } from "@ethersproject/hash";
import { keccak256 } from '@ethersproject/keccak256'
import { useContractReader, useEventListener, useNonce } from "../hooks";


export default function ExampleUI({purpose, setPurposeEvents, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  // keep track of a variable from the contract in the local React state:
  const random = useContractReader(readContracts,"YourContract", "getRandom", [])
  console.log("revealed number",random)
  
  // const [dataHash, setDataHash] = useState('0');
  const [revealHash, setRevealHash] = useState('0');

  // let hash = useContractReader(readContracts,"YourContract", "getHash", [dataHash])

  // if (dataHash === '0') {
  //   setDataHash(message);
  //   hash = id(message + writeContracts.YourContract.address)
  //   setRevealHash(hash);
  // }

  //📟 Listen for broadcast YourContract
  const commitEvents = useEventListener(readContracts, "YourContract", "CommitHash", localProvider, 1);
  console.log("📟 Commit events:",commitEvents)

  //📟 Listen for broadcast YourContract
  const revealEvents = useEventListener(readContracts, "YourContract", "RevealHash", localProvider, 1);
  console.log("📟 Reveal events:", revealEvents)

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
        <h2>Commit and Reveal:</h2>


        <Divider/>

        <h4>Revealed Number: {random && random.toString()}</h4>


        <div style={{margin:8}}>
          <Button onClick={async ()=>{
            let message = id(Math.random().toString())
            let revealHash = await readContracts["YourContract"]["getHash"](message);
            setRevealHash(message)
            tx( writeContracts.YourContract.commit(revealHash) )
          }}>Commit</Button>
        </div>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how you call setPurpose on your contract: */
            tx(writeContracts.YourContract.reveal(revealHash) )
          }}>Reveal</Button>
        </div>


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
        <h2>Commit Events:</h2>
        <List
          bordered
          dataSource={commitEvents}
          renderItem={(item) => {
            return (
              <List.Item>
                <Address
                    value={item[0]}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> => 
                {item[1]}
              </List.Item>
            )
          }}
        />
      </div>

      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Reveal Events:</h2>
        <List
          bordered
          dataSource={revealEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.sender+"_"+item.purpose}>
                <Address
                    value={item[0]}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> =>
                {item[1]} => {item[2].toString()}
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
