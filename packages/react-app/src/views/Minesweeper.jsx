/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "../hooks";

export default function Minsweeper({currentPlayer, playerCount, newPlayerJoinedEvents, turnCompletedEvents, isGameOn, currentReveal, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const [newPurpose, setNewPurpose] = useState("loading...");
  const deadline = useContractReader(readContracts,"YourContract","timeLeft");
  const currentP = useContractReader(readContracts,"YourContract","currentPlayer");
  console.log("Turn completed", currentP)
  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
        <h2>Minesweeper 🤖</h2>

        <h4>Player Count: {playerCount}</h4>

        <Divider/>

        {!isGameOn && <div style={{margin:8, padding:5}}>
          <Input onChange={(e)=>{setNewPurpose(e.target.value)}} />
          
          <Button onClick={()=>{
            console.log("newPurpose",newPurpose)
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.steakAndParticipate(newPurpose) )
          }}>Stake & Participate</Button>
          <div style={{margin:8, padding:5}}>
          <Button onClick={()=>{

            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.startGame() )
          }}>Start the Game!</Button>
          </div>
        </div>
        }
        {isGameOn && 
          <div>
            <div style={{margin:8}}>
                <h2>Current Reveal is : {currentReveal}</h2>
            </div>
            <Button onClick={()=>{

            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.generateRandomNumber() )
          }}>Spin the Roulette wheel</Button>
          </div>
        }

        <Divider />

        Your Address:  
        <Address
            value={address}
            ensProvider={mainnetProvider}
            fontSize={16}
        />

      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
        <div style={{display:'flex', flexDirection:'row'}}>
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Participants :</h2>
        <List
          bordered
          dataSource={newPlayerJoinedEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.sender}>
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
              <h2>Game Deets :</h2>
            <h2>Is Game on: {(isGameOn != null) && isGameOn.toString()}</h2>
            {isGameOn && 
            <div>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                 
                  <h3> Current Player :  </h3>
                  {/* {turnCompletedEventsP[currentP] &&<Address>
                      value={}
                      ensProvider={mainnetProvider}
                      fontSize={12}
                  </Address>} */}
                 <List
          bordered
          dataSource={turnCompletedEvents.slice(0,1)}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.sender}>
                <Address
                    value={item[0]}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  />
              </List.Item>
            )
          }}
        />

              </div>
                  <h3> Current Deadline : {deadline && deadline.toNumber()}</h3>
                <Button onClick={()=>{

                /* look how you call setPurpose on your contract: */
                tx( writeContracts.YourContract.endGame() )
              }}>End the Game</Button>
            </div>
            }
        </div>
      </div>
        <Button onClick={()=>{
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.reset() )
          }}>
            Reset 💀
          </Button>    
    </div>
  );
}
