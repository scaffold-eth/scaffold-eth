import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { useState, useEffect, useCallback } from 'react';

import { TEthHooksProvider } from '~~/models';

/**
 * Enables you to keep track of events
 * 
 * ~ Features ~
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
export default function useEventListener(
  contracts: Record<string, Contract>,
  contractName: string,
  eventName: string,
  provider: TEthHooksProvider,
  startBlock: number
): any[] {
  const [updates, setUpdates] = useState<any[]>([]);

  const addNewEvent = useCallback((...args: any[]) => {
    const blockNumber = args?.[args.length - 1]?.blockNumber;
    // eslint-disable-next-line
    setUpdates((messages) => [{ blockNumber, ...args.pop().args }, ...messages]);
  }, []);

  useEffect(() => {
    if (provider) {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock);
    }
    if (contracts?.[contractName] != undefined) {
      try {
        contracts[contractName].on(eventName, addNewEvent);
        return () => {
          contracts[contractName].off(eventName, addNewEvent);
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [provider, startBlock, contracts, contractName, eventName, addNewEvent]);

  return updates;
}
