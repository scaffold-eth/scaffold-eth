import { useState } from 'react';
import { usePoller } from "eth-hooks";

export default function useContractReader(contracts,contractName,variableName,pollTime) {

  const [value, setValue] = useState();
  usePoller(async ()=>{
    if(contracts && contracts[contractName]){
      let newValue = await contracts[contractName][variableName]()
      if(newValue!=value){
        setValue(newValue)
      }
    }
  },pollTime?pollTime:777)

  return value;
}
