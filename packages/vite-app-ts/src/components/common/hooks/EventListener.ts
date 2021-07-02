import { JsonRpcProvider, Listener, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { useEffect, useState } from 'react';

/*
  ~ What it does? ~

  Enables you to keep track of events

  ~ How can I use? ~

  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);


*/

/**
 * Enables you to keep track of events
 * 
  ~ Features ~
  - Provide readContracts by loading contracts (see more on ContractLoader.js)
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the name of the event in the contract, in this case we keep track of "SetPurpose" event
  - Specify the provider
 * @param contracts 
 * @param contractName 
 * @param eventName 
 * @param provider 
 * @param startBlock 
 * @param args 
 * @returns 
 */
export const useEventListener = (
  contracts: Record<string, Contract>,
  contractName: string,
  eventName: string,
  provider: JsonRpcProvider | Web3Provider | undefined,
  startBlock: number,
  ...args: any[]
) => {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (typeof provider !== 'undefined' && typeof startBlock !== 'undefined') {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock);
    }
    if (contracts && contractName && contracts[contractName]) {
      try {
        contracts[contractName].on(eventName, (...args: any[]) => {
          const blockNumber = args[args.length - 1].blockNumber;
          setUpdates((messages) => [{ blockNumber, ...args.pop().args }, ...messages]);
        });
        return () => {
          contracts[contractName].removeListener(eventName, () => {});
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [provider, startBlock, contracts, contractName, eventName]);

  return updates;
};
