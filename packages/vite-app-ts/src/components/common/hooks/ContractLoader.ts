/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { parseProviderOrSigner } from '~~/components/common/functions/providerOrSigner';
import { contractDirectory } from './contractConstants';

const loadContract = async (contractName: string, signer: Signer) => {
  // @ts-ignore
  const addressJs = (await import(`./${contractDirectory}/${contractName}.address.js`)).default;
  const contract = (await import(`./${contractDirectory}/${contractName}.abi.js`)).default;

  const newContract = new Contract(addressJs, contract, signer);
  try {
    // @ts-ignore
    const bytecodeJs = (await import(`./${contractDirectory}/${contractName}.bytecode.js`)).default;
    // @ts-ignore
    newContract.bytecode = bytecodeJs;
  } catch (e) {
    console.log(e);
  }
  return newContract;
};

const loadContractList = async (contractList: string[], signer: Signer | undefined) => {
  const contracts: Record<string, Contract> = {};

  if (signer) {
    await contractList.forEach(async (c) => {
      contracts[c] = await loadContract(c, signer);
    });
  }
  return contracts;
};

interface IContractConfig {
  chainId?: number;
  hardhatContracts?: any;
  externalContracts?: any;
  hardhatNetworkName?: string;
  customAddresses?: Record<string, string>;
}

/**
 * Loads your local contracts and gives options to read values from contracts
  or write transactions into them

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
 * @param providerOrSigner 
 * @param config 
 * @returns 
 */
export const useContractLoader = (
  providerOrSigner: JsonRpcProvider | undefined | Signer,
  config: IContractConfig = {}
) => {
  const [contracts, setContracts] = useState<Record<string, Contract>>({});
  useEffect(() => {
    let active = true;

    const loadContracts = async () => {
      if (providerOrSigner && typeof providerOrSigner !== 'undefined') {
        console.log(`loading contracts`);
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          if (typeof providerOrSigner !== 'undefined') {
            // we need to check to see if this providerOrSigner has a signer or not
            const { signer, provider, providerNetwork } = await parseProviderOrSigner(providerOrSigner);

            const chainId = config.chainId ?? providerNetwork?.chainId ?? 0;

            let contractList: Record<string, any> = {};
            let externalContractList: Record<string, any> = {};
            try {
              contractList =
                config.hardhatContracts || (await import(`./${contractDirectory}/hardhat_contracts.json`)).default;
            } catch (e) {
              console.log(e);
            }
            try {
              externalContractList =
                config.externalContracts || (await import(`./${contractDirectory}/external_contracts.js`)).default;
            } catch (e) {
              console.log(e);
            }

            let combinedContracts: Record<string, any> = {};

            if (contractList[chainId]) {
              for (const hardhatNetwork in contractList[chainId]) {
                if (Object.prototype.hasOwnProperty.call(contractList[chainId], hardhatNetwork)) {
                  if (!config.hardhatNetworkName || hardhatNetwork === config.hardhatNetworkName) {
                    combinedContracts = {
                      ...combinedContracts,
                      ...contractList[chainId][hardhatNetwork].contracts,
                    };
                  }
                }
              }
            }

            if (externalContractList[chainId]) {
              combinedContracts = { ...combinedContracts, ...externalContractList[chainId].contracts };
            }

            const newContracts = Object.keys(combinedContracts).reduce(
              (accumulator: Record<string, any>, contractName: string) => {
                const _address =
                  config.customAddresses && Object.keys(config.customAddresses).includes(contractName)
                    ? config.customAddresses[contractName]
                    : combinedContracts[contractName].address;
                accumulator[contractName] = new ethers.Contract(_address, combinedContracts[contractName].abi, signer);
                return accumulator;
              },
              {}
            );
            if (active) setContracts(newContracts);
          }
        } catch (e) {
          console.log('ERROR LOADING CONTRACTS!!', e);
        }
      }
    };

    loadContracts();

    return () => {
      active = false;
    };
  }, [providerOrSigner, config.chainId, config.hardhatNetworkName]);

  return contracts;
};
