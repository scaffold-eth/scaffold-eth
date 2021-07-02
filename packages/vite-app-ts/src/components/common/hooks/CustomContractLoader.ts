/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

const fileLocation = '../../../contracts';

/**
 * Enables you to load a local contract with custom address
 * when you want to load a local contract's abi but supply a custom address
 * 
  ~ Features ~
  - Specify the localProvider
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the customAddress of your contract
 * @param provider 
 * @param contractName 
 * @param address 
 * @returns 
 */
export const useCustomContractLoader = (
  provider: JsonRpcProvider | Web3Provider,
  contractName: string,
  address: string
) => {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (typeof provider !== 'undefined' && contractName && address) {
        try {
          // we need to check to see if this provider has a signer or not
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length > 0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const customContract = new Contract(address, require(`./${fileLocation}/${contractName}.abi.js`), signer);
          try {
            const bytecodeJs = (await import(`./${fileLocation}/contracts/${contractName}.bytecode.js`)).default;
            // @ts-ignore
            customContract.bytecode = bytecodeJs;
          } catch (e) {
            console.log(e);
          }

          setContract(customContract);
        } catch (e) {
          console.log('ERROR LOADING CONTRACTS!!', e);
        }
      }
    }
    loadContract();
  }, [provider, contractName, address]);
  return contract;
};
