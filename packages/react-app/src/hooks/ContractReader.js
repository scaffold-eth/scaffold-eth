import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { usePoller } from ".";

const DEBUG = false

export default function useContractReader(contracts,contractName,functionName,args,pollTime,formatter,onChange) {

  let adjustPollTime = 3777
  if(pollTime){
    adjustPollTime = pollTime
  } else if(!pollTime && typeof args == "number"){
    //it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args
  }

  const [value, setValue] = useState()
  useEffect(() => {
    if(typeof onChange == "function"){
      setTimeout(onChange.bind(this,value),1)
    }
  }, [value]);

  usePoller(async ()=>{
    if(contracts && contracts[contractName]){
      try{
        let newValue
        if(DEBUG) console.log("CALLING ",contractName,functionName, "with args", args)
        if(args&&args.length > 0){
          newValue = await contracts[contractName][functionName](...args)
          if(DEBUG) console.log("contractName",contractName,"functionName",functionName,"args",args,"RESULT:",newValue)
        }else{
          newValue = await contracts[contractName][functionName]()
          if(DEBUG) console.log("contractName",contractName,"functionName",functionName,"RESULT:",newValue)
        }
        if(formatter && typeof formatter == "function"){
          newValue = formatter(newValue)
        }
        //console.log("GOT VALUE",newValue)
        if(newValue!=value){
          setValue(newValue)
        }
      }catch(e){
        if(DEBUG) console.log(e)
      }
    }
  },adjustPollTime)

  return value;
}
