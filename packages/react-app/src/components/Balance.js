import React, { useState } from 'react'
import { ethers } from "ethers";
import { usePoller } from "../hooks";

export default function Balance(props) {

  const [dollarMode, setDollarMode] = useState(true);
  const [balance, setBalance] = useState();
  usePoller(async ()=>{
    if(props.address && props.provider){
      try{
        const newBalance = await props.provider.getBalance(props.address)
        setBalance(newBalance)
      }catch(e){
        console.log(e)
      }
    }
  },props.pollTime?props.pollTime:1999)

  let floatBalance = parseFloat("0.00")

  if(typeof props.balance != "undefined"){
    setBalance(props.balance);
  }

  if(balance){
    let etherBalance = ethers.utils.formatEther(balance)
    parseFloat(etherBalance).toFixed(2)
    floatBalance = parseFloat(etherBalance)
  }

  let displayBalance = floatBalance.toFixed(4)

  //console.log("dollarMultiplier",props.dollarMultiplier)

  if(props.dollarMultiplier && dollarMode){
    displayBalance = "$"+(floatBalance*props.dollarMultiplier).toFixed(2)
  }

  return (
    <span style={{verticalAlign:"middle",fontSize:24,padding:8,cursor:'pointer'}} onClick={()=>{setDollarMode(!dollarMode)}}>
      {displayBalance}
    </span>
  );
}
