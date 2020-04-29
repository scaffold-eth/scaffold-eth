import { useState } from 'react';
import { usePoller } from "eth-hooks";

export default function useContractReader(contracts,contractName,variableName,pollTime) {

  const [value, setValue] = useState();
  usePoller(async ()=>{
    if(contracts && contracts[contractName]){
      try{
        let newValue = await contracts[contractName][variableName]()
        if(newValue!=value){
          setValue(newValue)
        }
      }catch(e){
        console.log(e)
      }
    }
  },pollTime?pollTime:3777)

  return value;
}
