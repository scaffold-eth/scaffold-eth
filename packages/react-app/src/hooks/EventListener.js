import { useState, useEffect } from 'react';

export default function useEventListener(contracts,contractName,eventName,provider,startBlock,args) {

  const [updates,setUpdates] = useState([]);

  useEffect(() => {
    if(typeof provider != "undefined"&&typeof startBlock != "undefined"){
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock)
    }
    if(contracts && contractName && contracts[contractName]){
      try{
        contracts[contractName].on(eventName, (...args) => {
          setUpdates(messages => [...messages, (args.pop()).args])
        });
        return ()=>{
          contracts[contractName].removeListener(eventName)
        }
      }catch(e){
        console.log(e)
      }
    }
  },[provider,contracts,contractName,eventName])

  return updates;
}
