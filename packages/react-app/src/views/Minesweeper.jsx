/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { BigNumber} from "@ethersproject/bignumber";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "../hooks";

export default function Minesweeper({newPlayerJoinedEvents, turnCompletedEvents, isGameOn, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  let currentPlayer;
  const steakValue = 0.01;
  var balances = {};
  const [newPurpose, setNewPurpose] = useState("loading...");
  const turnTimeLeft = useContractReader(readContracts,"YourContract","turnTimeLeft");
  const stakingTimeLeft = useContractReader(readContracts,"YourContract","steakingTimeLeft");
  const playerCount = useContractReader(readContracts,"YourContract","playerCount");
  const currentReveal = useContractReader(readContracts,"YourContract","currentReveal");
  const totalStakingPool = useContractReader(readContracts,"YourContract","totalStakingPool");
  const currentWinner = useContractReader(readContracts,"YourContract","currentWinner");
  const currentIndex = useContractReader(readContracts,"YourContract","currentIndex");
  const players = useContractReader(readContracts,"YourContract", "players",[0]);
  
  currentPlayer = useContractReader(readContracts,"YourContract", "players",[currentIndex]);

  return (
    <div>
      <div style={{border:"1px solid #cccccc", padding:16, width:600, margin:"auto",marginTop:64}}>
        <h2>Minesweeper 🤖</h2>

        <h4>Player Count: {playerCount && playerCount.toNumber()}</h4>

        <Divider/>

        {!isGameOn && <div style={{margin:8, padding:5}}>
        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>        
        <div>
        <h2>Current Pool Value: </h2>
        <Balance
              balance={totalStakingPool}
              fontSize={64}
            />
          </div>
            <div>
            <h2> Staking time left : </h2>
            <h2> {stakingTimeLeft && stakingTimeLeft.toNumber()}</h2>
            </div>
          </div>
          <div style={{margin:8, padding:5}}>
          <Button onClick={()=> tx( writeContracts.YourContract.steakAndParticipate({value:parseEther(steakValue.toString())}))}>
            Stake & Participate
          </Button>
          </div>
          <div style={{margin:8, padding:5}}>
          <Button onClick={()=>{
            tx( writeContracts.YourContract.startGame())
            }}>Start the Game!</Button>
          </div>
        </div>
        }
        {isGameOn && 
        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
            {(currentIndex && playerCount && (currentIndex.toNumber() < playerCount.toNumber())) && <div>
            <div style={{margin:8}}>
                <h2>Current Reveal is : {currentReveal && currentReveal.toNumber()}</h2>
            </div>
            {(turnTimeLeft && turnTimeLeft.toNumber()!=0) && <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-evenly'}}>
              <Address
                    value={currentPlayer}
                  /> turn to 
            <Button onClick={()=>{

            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.generateRandomNumber() )
          }}>Spin the Roulette wheel</Button>
            </div>
          }
          { (turnTimeLeft && turnTimeLeft.toNumber()==0)
            && <Button onClick={()=>{
            tx( writeContracts.YourContract.skipTurn() )
          }}>Skip turn</Button>
          }
          </div>}
          { !(currentIndex && playerCount && (currentIndex.toNumber() < playerCount.toNumber())) && <div>
            <div style={{margin:8}}>
                <h2>The Winner is :</h2> 
                <Address
                  value={currentWinner && currentWinner.winnerAddress}
                />
                <h2> with winning Number : {currentWinner && currentWinner.value}</h2>
            </div>
            
          </div>}
                        {!(currentIndex && playerCount && (currentIndex.toNumber() < playerCount.toNumber())) ? 
                        <div>
                        <h3> Game Over, Press reset to restart</h3> 
                        <Button onClick={()=>{
                          console.log("Button pressed")

            tx( writeContracts.YourContract.withdrawWinnings() )
            }}>Withdraw winnings</Button>
                        </div> :
                  <h3> Current Deadline : {turnTimeLeft && turnTimeLeft.toNumber()}</h3>}

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
        {(!isGameOn) ? <div><h2>Participants :</h2>
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
        /> </div>:
          <div>
<h2>Previous reveals :</h2>
        <List
          bordered
          dataSource={turnCompletedEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.sender+"_"+item.random}>
                <Address
                    value={item[0]}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> => {item[1]}
              </List.Item>
            )
          }}
        />          </div>
         }
        </div>
      {/* <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
              <h2>Game Deets :</h2>
            <h2>Is Game on: {(isGameOn != null) && isGameOn.toString()}</h2>
            {isGameOn && 
            <div>
              {
                (currentIndex && playerCount && (currentIndex.toNumber() < playerCount.toNumber())) &&
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <h3> Current Player :      </h3>
                   <Address
                    value={(turnCompletedEvents.length>=1) ? turnCompletedEvents[0].nextPlayer : newPlayerJoinedEvents[newPlayerJoinedEvents.length-1].steaker}
                  />
              </div>
              }
              {!(currentIndex && playerCount && (currentIndex.toNumber() < playerCount.toNumber())) ? <h3> Game Over, Press reset to restart</h3> :
                  <h3> Current Deadline : {turnTimeLeft && turnTimeLeft.toNumber()}</h3>}
                <Button onClick={()=>{tx( writeContracts.YourContract.endGame() )
              }}>End the Game</Button>
            </div>
            }
        </div> */}
      </div>
      <Button onClick={()=>{tx( writeContracts.YourContract.endGame() )
              }}>End the Game</Button>
        <Button onClick={()=>{
            /* look how you call resret on your contract: */
            tx( writeContracts.YourContract.reset() )
          }}>
            Reset 💀
          </Button>    
    </div>
  );
}
