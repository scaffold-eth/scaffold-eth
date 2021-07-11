import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { parseProviderOrSigner } from '~~/functions/providerOrSigner';
import { TProviderOrSigner } from '~~/models/providerTypes';

export type TContractConfig = {
  chainId?: number;
  hardhatNetworkName?: string;
  customAddresses?: Record<string, string>;
  hardhatContracts?: Record<string, Contract>;
  externalContracts?: Record<string, Contract>;
};

export enum DefaultContractLocation {
  reactAppContracts = '../../react-app/src/generated/contracts',
  viteAppContracts = '../../vite-app-ts/src/generated/contracts',
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
 * @param safeConfig 
 * @returns Hash: contractName: Contract
 */
export const useContractLoader = (
  providerOrSigner: TProviderOrSigner | undefined,
  config: TContractConfig = {},
  contractFileLocation: DefaultContractLocation | string = DefaultContractLocation.viteAppContracts
): Record<string, Contract> => {
  const [contracts, setContracts] = useState<Record<string, Contract>>({});

  useEffect(() => {
    let active = true;

    const loadContracts = async (): Promise<void> => {
      if (providerOrSigner && typeof providerOrSigner !== 'undefined') {
        console.log(`loading contracts`);
        console.log(providerOrSigner, config);
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          if (typeof providerOrSigner !== 'undefined') {
            // we need to check to see if this providerOrSigner has a signer or not
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { signer, providerNetwork } = await parseProviderOrSigner(providerOrSigner);

            const chainId: number = config.chainId ?? providerNetwork?.chainId ?? 0;

            // type definition
            //  Record<string, Record<string, Contract>>
            //  { chainId: { contractName: Contract } }
            let contractList: Record<string, Record<string, Contract>> = {};
            let externalContractList: Record<string, Record<string, Contract>> = {};

            let combinedContracts: Record<string, Contract> = {};
            try {
              contractList =
                config.hardhatContracts ??
                ((await import(`./${contractFileLocation}/hardhat_contracts.json`)) as Record<string, Contract>)
                  .default;
            } catch (e) {
              console.log(e);
            }

            try {
              externalContractList =
                config.externalContracts ??
                ((await import(`./${contractFileLocation}/external_contracts.js`)) as Record<string, Contract>).default;
            } catch (e) {
              console.log(e);
            }

            if (contractList?.[chainId] != undefined) {
              for (const hardhatNetwork in contractList[chainId]) {
                if (Object.prototype.hasOwnProperty.call(contractList[chainId], hardhatNetwork)) {
                  if (!config.hardhatNetworkName || hardhatNetwork === config.hardhatNetworkName) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    combinedContracts = {
                      ...combinedContracts,
                      ...contractList[chainId][hardhatNetwork].contracts,
                    };
                  }
                }
              }
            }

            if (externalContractList?.[chainId] != undefined) {
              combinedContracts = { ...combinedContracts, ...externalContractList[chainId].contracts };
            }

            const newContracts = Object.keys(combinedContracts).reduce(
              (accumulator: Record<string, any>, contractName: string) => {
                const address: string =
                  config.customAddresses && Object.keys(config.customAddresses).includes(contractName)
                    ? config.customAddresses[contractName]
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

    return (): void => {
      active = false;
    };
  }, [contractFileLocation, providerOrSigner, JSON.stringify(config)]);

  return contracts;
};
