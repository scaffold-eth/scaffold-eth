import { useState, useEffect, useCallback } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

/*
  ~ What it does? ~

  Enables you to keep track of events

  ~ How can I use? ~

  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);

  ~ Features ~

  - Provide readContracts by loading contracts (see more on ContractLoader.js)
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the name of the event in the contract, in this case we keep track of "SetPurpose" event
  - Specify the provider
*/

export default function useEventListener(
  contracts: Record<string, Contract>,
  contractName: string,
  eventName: string,
  provider: Web3Provider,
  startBlock: number,
  args?: any[]
): any[] {
  const [updates, setUpdates] = useState<any[]>([]);

  const addNewEvent = useCallback(
    (...args: any) => {
      const blockNumber = args[args.length - 1].blockNumber;
      setUpdates(messages => [{ blockNumber, ...args.pop().args }, ...messages]);
    },
    []
  );

  useEffect(() => {
    if (typeof provider !== "undefined") {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock);
    }
    if (contracts && contractName && contracts[contractName]) {
      try {
        contracts[contractName].on(eventName, addNewEvent);
        return () => {
          contracts[contractName].off(eventName, addNewEvent);
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [provider, startBlock, contracts, contractName, eventName]);

  return updates;
}
