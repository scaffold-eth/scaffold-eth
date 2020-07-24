/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

const loadContract = (contractName, signer) => {
  const newContract = new Contract(
    require(`../contracts/${contractName}.address.js`),
    require(`../contracts/${contractName}.abi.js`),
    signer,
  );
  try {
    newContract.bytecode = require(`../contracts/${contractName}.bytecode.js`);
  } catch (e) {
    console.log(e);
  }
  return newContract;
};

export default function useContractLoader(provider) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContracts() {
      if (typeof provider !== "undefined") {
        try {
          // we need to check to see if this provider has a signer or not
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length > 0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const contractList = require("../contracts/contracts.js");

          const newContracts = contractList.reduce((accumulator, contractName) => {
            accumulator[contractName] = loadContract(contractName, signer);
            return accumulator;
          }, {});
          setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();
  }, [provider]);
  return contracts;
}
