import { useState } from 'react';
import usePoller from "./Poller.js";
import { ethers } from "ethers";
export default function useBalance(account,provider,pollTime) {

  const [balance, setBalance] = useState(0);
  const pollBalance = async ()=>{
    if(account&&provider){
      let newBalance = await provider.getBalance(account)
      newBalance = ethers.utils.formatEther(newBalance)
      if(newBalance!=balance){
        //console.log("NEW BALANCE:",newBalance,"Current balance",balance)
        setBalance(newBalance)
      }
    }
  }
  usePoller(pollBalance,pollTime?pollTime:777)

  return balance;
}
