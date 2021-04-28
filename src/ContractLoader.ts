/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from "@ethersproject/contracts";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";

/*
  ~ What it does? ~

  Loads your local contracts and gives options to read values from contracts
                                              or write transactions into them

  ~ How can I use? ~

  const readContracts = useContractLoader(localProvider) // or
  const writeContracts = useContractLoader(userProvider)

  ~ Features ~

  - localProvider enables reading values from contracts
  - userProvider enables writing transactions into contracts
  - Example of keeping track of "purpose" variable by loading contracts into readContracts
    and using ContractReader.js hook:
    const purpose = useContractReader(readContracts,"YourContract", "purpose")
  - Example of using setPurpose function from our contract and writing transactions by Transactor.js helper:
    tx( writeContracts.YourContract.setPurpose(newPurpose) )
*/

const loadContract = (
  contractName: string,
  signer: Web3Provider | JsonRpcSigner,
  contractsPath: string
): Contract => {
  const newContract = new Contract(
    require(require.main?.path + contractsPath + `/${contractName}.address.js`),
    require(require.main?.path + contractsPath + `/${contractName}.abi.js`),
    signer,
  );
  // try {
  //   newContract.bytecode = require(`../contracts/${contractName}.bytecode.js`);
  // } catch (e) {
  //   console.log(e);
  // }
  return newContract;
};

export default function useContractLoader(
  providerOrSigner: Web3Provider,
  contractsPath: string = "../contracts"
): any {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContracts() {
      if (typeof providerOrSigner !== "undefined") {
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          let signer: Web3Provider | JsonRpcSigner;
          let accounts;
          if (providerOrSigner && typeof providerOrSigner.listAccounts === "function") {
            accounts = await providerOrSigner.listAccounts();
          }

          if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
          } else {
            signer = providerOrSigner;
          }

          const contractList = require(require.main?.path + contractsPath + "/contracts.js");

          const newContracts = contractList.reduce((accumulator: any, contractName: string) => {
            accumulator[contractName] = loadContract(contractName, signer, contractsPath);
            return accumulator;
          }, {});
          setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();
  }, [providerOrSigner]);
  return contracts;
}
