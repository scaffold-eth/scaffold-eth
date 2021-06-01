import { useState, useEffect, useCallback } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

export default function useEventListener(
  contract: Contract,
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
    if (contract) {
      try {
        contract.on(eventName, addNewEvent);
        return () => {
          contract.off(eventName, addNewEvent);
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [provider, startBlock, contract, eventName, addNewEvent]);

  return updates;
}
