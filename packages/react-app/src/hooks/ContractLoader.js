/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { useEffect, useState } from "react";

const { ethers } = require("ethers");

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

export default function useContractLoader(providerOrSigner, network = {}, customAddresses = {}) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContracts() {
      if (typeof providerOrSigner !== "undefined") {
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          let signer;
          let provider;
          let accounts;

          if (providerOrSigner && typeof providerOrSigner.listAccounts === "function") {
            accounts = await providerOrSigner.listAccounts();
          }

          if (ethers.Signer.isSigner(providerOrSigner)) {
            signer = providerOrSigner;
            provider = signer.provider;
          } else if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
            provider = providerOrSigner;
          } else {
            signer = providerOrSigner;
            provider = providerOrSigner;
          }

          const providerNetwork = await provider.getNetwork();

          const _chainId = network.chainId || providerNetwork.chainId;

          let contractList = {};
          let externalContractList = {};
          try {
            contractList = require("../contracts/contracts.json");
          } catch (e) {
            console.log(e);
          }
          try {
            externalContractList = require("../contracts/external_contracts.js");
          } catch (e) {
            console.log(e);
          }

          let combinedContracts = {};

          if (contractList[_chainId]) {
            for (const hardhatNetwork in contractList[_chainId]) {
              if (Object.prototype.hasOwnProperty.call(contractList[_chainId], hardhatNetwork)) {
                if (!network.name || hardhatNetwork === network.name) {
                  combinedContracts = {
                    ...combinedContracts,
                    ...contractList[_chainId][hardhatNetwork].contracts,
                  };
                }
              }
            }
          }

          if (externalContractList[_chainId]) {
            combinedContracts = { ...combinedContracts, ...externalContractList[_chainId].contracts };
          }

          const newContracts = Object.keys(combinedContracts).reduce((accumulator, contractName) => {
            const _address = Object.keys(customAddresses).includes(contractName)
              ? customAddresses[contractName]
              : combinedContracts[contractName].address;
            accumulator[contractName] = new ethers.Contract(_address, combinedContracts[contractName].abi, signer);
            return accumulator;
          }, {});
          setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();
  }, [providerOrSigner, network.chainId, network.name]);

  return contracts;
}
