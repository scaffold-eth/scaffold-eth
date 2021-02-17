/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { BigNumber} from "@ethersproject/bignumber";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "../hooks";

export default function Minsweeper({newPlayerJoinedEvents, turnCompletedEvents, isGameOn, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const [newPurpose, setNewPurpose] = useState("loading...");
  const turnTimeLeft = useContractReader(readContracts,"YourContract","turnTimeLeft");
  const stakingTimeLeft = useContractReader(readContracts,"YourContract","steakingTimeLeft");
  const playerCount = useContractReader(readContracts,"YourContract","playerCount");
  const currentReveal = useContractReader(readContracts,"YourContract","currentReveal");
  const totalStakingPool = useContractReader(readContracts,"YourContract","totalStakingPool");

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
        <h2>Minesweeper 🤖</h2>

        <h4>Player Count: {playerCount && playerCount.toNumber()}</h4>

        <Divider/>

        {!isGameOn && <div style={{margin:8, padding:5}}>
        <h2>Current Pool Value: </h2>
        <Balance
              balance={totalStakingPool}
              fontSize={64}
            />
          <Input onChange={(e)=>{setNewPurpose(e.target.value)}} />
          
          <Button onClick={()=>{
            console.log("newPurpose",newPurpose)
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.steakAndParticipate({value:parseEther(newPurpose)}) )
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
                <h2>Current Reveal is : {currentReveal && currentReveal.toNumber()}</h2>
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
                        <Balance
                          balance={item[1]}
                        />
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
                 <List
          bordered
          dataSource={(turnCompletedEvents.length > 0) ? turnCompletedEvents.slice(0,1) : newPlayerJoinedEvents.slice(newPlayerJoinedEvents.length-1,newPlayerJoinedEvents.length)}
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
                  <h3> Current Deadline : {turnTimeLeft && turnTimeLeft.toNumber()}</h3>
                <Button onClick={()=>{tx( writeContracts.YourContract.endGame() )
              }}>End the Game</Button>
            </div>
            }
        </div>
      </div>
        <Button onClick={()=>{
            /* look how you call resret on your contract: */
            tx( writeContracts.YourContract.reset() )
          }}>
            Reset 💀
          </Button>    
    </div>
  );
}
