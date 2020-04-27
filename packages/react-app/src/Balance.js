import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import { usePoller } from "eth-hooks";
import { Typography } from 'antd';
const { Text } = Typography;

export default function Balance(props) {

  const [balance, setBalance] = useState();
  usePoller(async ()=>{
    try{
      const newBalance = await props.provider.getBalance(props.address)
      setBalance(newBalance)
    }catch(e){
      console.log(e)
    }

  },props.pollTime?props.pollTime:1999)

  console.log("balance",balance)

  let floatBalance = parseFloat("0.00")

  if(balance){
    let etherBalance = ethers.utils.formatEther(balance)
    parseFloat(etherBalance).toFixed(2)
    floatBalance = parseFloat(etherBalance)
  }

  let displayBalance = floatBalance.toFixed(4)

  console.log("dollarMultiplier",props.dollarMultiplier)

  if(props.dollarMultiplier){
    displayBalance = "$"+(floatBalance*props.dollarMultiplier).toFixed(2)
  }

  return (
    <span style={{verticalAlign:"middle",fontSize:24,padding:8}}>
      {displayBalance}
    </span>
  );
}
