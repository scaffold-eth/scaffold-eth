/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

export default function useContractLoader(provider) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContract() {
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
          const newContracts = contractList.map(contractName => {
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
          });
          setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContract();
  }, [provider]);
  return contracts;
}
