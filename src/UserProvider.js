import React, { useState } from 'react';
import usePoller from "./Poller.js";
import { ethers } from "ethers";
import BurnerProvider from 'burner-provider';
export default function useUserProvider(localProvider,mainnetProvider,pollTime) {

  const [injectedProvider, setInjectedProvider] = useState();
  const createBurnerIfNoAccount = () => {
    if (!injectedProvider){
      if(localProvider.connection && localProvider.connection.url){
        setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider(localProvider.connection.url)))
      }else{
        setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider(mainnetProvider.providers[0].connection.url)))
      }
    }else{
      pollInjectedProvider()
    }
  }
  React.useEffect(createBurnerIfNoAccount, [injectedProvider]);

  const [account, setAccount] = useState();
  const pollInjectedProvider = async ()=>{
    if(injectedProvider){
      let accounts = await injectedProvider.listAccounts()
      if(accounts && accounts[0] && accounts[0]!=account){
        //console.log("ACCOUNT: ",accounts[0])
        setAccount(accounts[0])
      }
    }
  }
  usePoller(pollInjectedProvider,pollTime?pollTime:1999)


  return [account,injectedProvider];
}
