/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import usePoller from "./Poller";
import useOnBlock from "./OnBlock";
import { BLOCK_TIME } from "./constants";

const DEBUG = false;

export default function useContractReader(
  contract: Contract,
  functionName: string,
  args?: any[],
  pollTime?: number,
  formatter?: (...args: any[]) => any,
  onChange?: (newValue: any) => void,
): any {
  let adjustPollTime = 0;
  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof args === "number") {
    // it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args;
  }

  const [value, setValue] = useState();
  useEffect(() => {
    if (typeof onChange === "function") {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value, onChange]);

  const updateValue = async () => {
    try {
      let newValue;
      if (DEBUG) console.log("CALLING ", functionName, "with args", args);
      if (args && args.length > 0) {
        newValue = await contract[functionName](...args);
        if (DEBUG)
          console.log("functionName", functionName, "args", args, "RESULT:", newValue);
      } else {
        newValue = await contract[functionName]();
      }
      if (formatter && typeof formatter === "function") {
        newValue = formatter(newValue);
      }
      // console.log("GOT VALUE",newValue)
      if (newValue !== value) {
        setValue(newValue);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Only pass a provider to watch on a block if we have a contract and no PollTime
  useOnBlock(
    (contract && adjustPollTime === 0) && contract.provider,
    () => {
    if (contract && typeof contract[functionName] === "function" && adjustPollTime === 0) {
      updateValue()
    }
  })

  // Use a poller if a pollTime is provided
  usePoller(async () => {
    if (contract && typeof contract[functionName] === "function" && adjustPollTime > 0) {
      if (DEBUG) console.log('polling!', functionName)
      updateValue()
    }
  }, adjustPollTime, contract)

  return value;
}
