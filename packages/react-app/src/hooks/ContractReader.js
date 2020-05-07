import { useState } from 'react';
import { ethers } from "ethers";
import { usePoller } from ".";

export default function useContractReader(contracts,contractName,functionName,args,pollTime) {

  let adjustPollTime = 3777
  if(pollTime){
    adjustPollTime = pollTime
  } else if(!pollTime && typeof args == "number"){
    //it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args
  }

  const [value, setValue] = useState();
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
