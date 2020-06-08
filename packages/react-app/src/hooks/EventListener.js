import { useState, useEffect } from 'react';

export default function useEventListener(contracts,contractName,eventName,provider,startBlock,args) {

  const [updates,setUpdates] = useState([]);

  const eventCallback = (...args) => {
    const block = args.pop()
    const event = Object.assign({}, { ...block.args }, {
      blockNumber: block.blockNumber,
      event: block.event
    })
    setUpdates(messages => [...messages, event].sort((a, b) => a.blockNumber > b.blockNumber ?1:-1))
  }

  useEffect(() => {
    if(typeof provider != "undefined"&&typeof startBlock != "undefined"){
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock)
    }
    if(contracts && contractName && contracts[contractName]){
      try{
        eventName.reduceRight((contract, event) => contract.on(event, eventCallback), contracts[contractName])
        return ()=>{
          eventName.reduceRight((contract, event) => contract.on(event), contracts[contractName])
        }
      }catch(e){
        console.log(e)
      }
    }
  },[provider,contracts,contractName,eventName.length])

  return updates;
}
