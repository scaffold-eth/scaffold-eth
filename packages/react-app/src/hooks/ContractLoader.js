import { ethers } from "ethers";
import { useState, useEffect } from 'react';

export default function useContractLoader(provider) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContract() {
      if(typeof provider != "undefined")
      {
        try{
          let contractList = require("../contracts/contracts.js")
          let newContracts = []

          //we need to check to see if this provider has a signer or not
          let signer
          let accounts
          if(provider.listAccounts){
            accounts = await provider.listAccounts()
          }
          if(accounts && accounts.length>0){
            signer = provider.getSigner()
          }else{
            signer = provider
          }

          for(let c in contractList){
            newContracts[contractList[c]] = new ethers.Contract(
              require("../contracts/"+contractList[c]+".address.js"),
              require("../contracts/"+contractList[c]+".abi.js"),
              signer,
            );
            try{
              newContracts[contractList[c]].bytecode = require("../contracts/"+contractList[c]+".bytecode.js")
            }catch(e){
              console.log(e)
            }
          }
          setContracts(newContracts)
        }catch(e){
          console.log("ERROR LOADING CONTRACTS!!",e)
        }
      }
    }
    loadContract()
  },[provider])
  return contracts
}
