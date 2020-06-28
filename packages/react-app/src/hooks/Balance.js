import { useState } from 'react';
import usePoller from "./Poller.js";
import { ethers } from "ethers";
export default function useBalance(provider,address,pollTime) {

  const [balance, setBalance] = useState(0);
  const pollBalance = async ()=>{
    if(address&&provider&&typeof provider.getBalance == "function"){
      let newBalance = await provider.getBalance(address)
      if(newBalance!==balance){
        //console.log("NEW BALANCE:",newBalance,"Current balance",balance)
        setBalance(newBalance)
      }
    }
  }
  usePoller(pollBalance,pollTime?pollTime:777)

  return balance;
}
