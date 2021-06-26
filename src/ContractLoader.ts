/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from "@ethersproject/contracts";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
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

  config can include:
  - chainId - to hardcode the chainId, irrespective of the providerOrSigner chainId
  - hardhatNetworkName - to hardcode the hardhat network of interest
  - customAddresses: { contractName: 0xCustomAddress } to hardcode the address for a given named contract
  - hardhatContracts: object following the hardhat deploy export format (Json with chainIds as keys, which have hardhat network names as keys, which contain arrays of contracts for each)
  - externalContracts: object with chainIds as keys, with an array of contracts for each
*/

type Config = {
  chainId?: number,
  hardhatNetworkName?: string,
  customAddresses?: Record<string, string>,
  hardhatContracts: Record<string, Contract>,
  externalContracts: Record<string, Contract>
}

export default function useContractLoader(
  providerOrSigner: JsonRpcProvider | Web3Provider,
  config: Config
) {
  const [contracts, setContracts] = useState<{[index: string]: Contract}>();
  useEffect(() => {
    let active = true;

    async function loadContracts() {
      if (providerOrSigner && typeof providerOrSigner !== "undefined") {
        console.log(`loading contracts`);
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          let signer: any;
          let provider: any;
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

          const _chainId: string = config.chainId || providerNetwork.chainId;

          let contractList: {[index: string]: any} = {};
          let externalContractList: {[index: string]: any} = {};
          try {
            contractList = config.hardhatContracts;
          } catch (e) {
            console.log(e);
          }
          try {
            externalContractList = config.externalContracts;
          } catch (e) {
            console.log(e);
          }

          let combinedContracts: {[index: string]: any} = {};

          if (contractList[_chainId]) {
            for (const hardhatNetwork in contractList[_chainId]) {
              if (Object.prototype.hasOwnProperty.call(contractList[_chainId], hardhatNetwork)) {
                if (!config.hardhatNetworkName || hardhatNetwork === config.hardhatNetworkName) {
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

          const newContracts = Object.keys(combinedContracts).reduce((accumulator: {[index: string]: Contract}, contractName: string) => {
            const _address =
              config.customAddresses && Object.keys(config.customAddresses).includes(contractName)
                ? config.customAddresses[contractName]
                : combinedContracts[contractName].address;
            accumulator[contractName] = new ethers.Contract(_address, combinedContracts[contractName].abi, signer);
            return accumulator;
          }, {});
          if (active) setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();

    return () => {
      active = false;
    };
  }, [providerOrSigner, config.chainId, config.hardhatNetworkName]);

  return contracts;
}
