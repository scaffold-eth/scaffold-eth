import { useState, useEffect } from 'react';

export default function useEventListener(contracts,contractName,eventName,provider,startBlock) {

  const [updates,setUpdates] = useState([]);

  useEffect(() => {
    if(typeof provider != "undefined"&&typeof startBlock != "undefined"){
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock)
    }
    if(contracts && contractName && contracts[contractName]){
      contracts[contractName].on(eventName, (oldOwner, newOwner) => {
        let obj = {oldOwner, newOwner}
        setUpdates(messages => [...messages, obj])
      });
      return ()=>{
        contracts[contractName].removeListener(eventName)
      }
    }
  },[provider,contracts,contractName,eventName])

  return updates;
}
