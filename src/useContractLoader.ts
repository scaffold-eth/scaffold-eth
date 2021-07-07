import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { parseProviderOrSigner } from '~~/functions/providerOrSigner';
import { TProviderOrSigner } from '~~/models/providerTypes';

export type TContractConfig = {
  chainId?: number;
  contractFileLocation?: string;
  hardhatNetworkName?: string;
  customAddresses?: Record<string, string>;
  hardhatContracts?: Record<string, Contract>;
  externalContracts?: Record<string, Contract>;
};

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
 * @param safeConfig 
 * @returns 
 */
export const useContractLoader = (
  providerOrSigner: TProviderOrSigner,
  config: TContractConfig = {}
): Record<string, Contract> => {
  const safeConfig: TContractConfig = {
    contractFileLocation: '../../../generated/contracts',
    hardhatContracts: {},
    externalContracts: {},
    ...config,
  };

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { signer, providerNetwork } = await parseProviderOrSigner(providerOrSigner);

            const chainId: number = safeConfig.chainId ?? providerNetwork?.chainId ?? 0;

            // type definition
            //  Record<string, Record<string, Contract>>
            //  { chainId: { contractName: Contract } }
            let contractList: Record<string, Record<string, Contract>> = {};
            let externalContractList: Record<string, Record<string, Contract>> = {};

            let combinedContracts: Record<string, Contract> = {};
            try {
              contractList =
                safeConfig.hardhatContracts ??
                (
                  (await import(`./${safeConfig.contractFileLocation!}/hardhat_contracts.json`)) as Record<
                    string,
                    Contract
                  >
                ).default;
            } catch (e) {
              console.log(e);
            }

            try {
              externalContractList =
                safeConfig.externalContracts ??
                (
                  (await import(`./${safeConfig.contractFileLocation!}/external_contracts.js`)) as Record<
                    string,
                    Contract
                  >
                ).default;
            } catch (e) {
              console.log(e);
            }
            if (contractList[chainId]) {
              for (const hardhatNetwork in contractList[chainId]) {
                if (Object.prototype.hasOwnProperty.call(contractList[chainId], hardhatNetwork)) {
                  if (!safeConfig.hardhatNetworkName || hardhatNetwork === safeConfig.hardhatNetworkName) {
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
                const address: string =
                  safeConfig.customAddresses && Object.keys(safeConfig.customAddresses).includes(contractName)
                    ? safeConfig.customAddresses[contractName]
                    : combinedContracts[contractName].address;
                accumulator[contractName] = new ethers.Contract(address, combinedContracts[contractName].abi, signer);
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

    void loadContracts();

    return () => {
      active = false;
    };
  }, [
    providerOrSigner,
    safeConfig.chainId,
    safeConfig.contractFileLocation,
    safeConfig.customAddresses,
    safeConfig.externalContracts,
    safeConfig.hardhatContracts,
    safeConfig.hardhatNetworkName,
  ]);

  return contracts;
};
