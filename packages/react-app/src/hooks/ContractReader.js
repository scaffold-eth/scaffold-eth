import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { usePoller } from ".";

export default function useContractReader(contracts,contractName,functionName,args,pollTime,formatter,onChange) {

  let adjustPollTime = 3777
  if(pollTime){
    adjustPollTime = pollTime
  } else if(!pollTime && typeof args == "number"){
    //it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args
  }


  const useStateWithCallback = (initialState, callback) => {
    const [state, setState] = useState(initialState);
    useEffect(() => callback(state), [state]);
    return [state, setState];
  };

  const [value, setValue] = useStateWithCallback(undefined,()=>{
    if(typeof onChange == "function"){
      setTimeout(onChange,1)
    }
  });


  usePoller(async ()=>{
    if(contracts && contracts[contractName]){
      try{
        let newValue
        //console.log("CALLING ",contractName,functionName, "with args", args)
        if(args&&args.length > 0){
          newValue = await contracts[contractName][functionName](...args)
          //console.log("contractName",contractName,"functionName",functionName,"args",args,"RESULT:",newValue)
        }else{
          newValue = await contracts[contractName][functionName]()
        }
        if(formatter && typeof formatter == "function"){
          newValue = formatter(newValue)
        }
        //console.log("GOT VALUE",newValue)
        if(newValue!=value){
          setValue(newValue)
        }
      }catch(e){
        console.log(e)
      }
    }
  },adjustPollTime)

  return value;
}
