import { ethers } from "ethers";
import { useState, useEffect } from 'react';

export default function useContractLoader(provider) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    if(typeof provider != "undefined")
    {
      try{
        let contractList = require("./contracts/contracts.js")
        let newContracts = []
        for(let c in contractList){
          newContracts[contractList[c]] = new ethers.Contract(
            require("./contracts/"+contractList[c]+".address.js"),
            require("./contracts/"+contractList[c]+".abi.js"),
            provider.getSigner(),
          );
          newContracts[contractList[c]].bytecode = require("./contracts/"+contractList[c]+".bytecode.js")
        }
        setContracts(newContracts)
      }catch(e){
        console.log(e)
      }
    }
  },[provider])
  return contracts
}
