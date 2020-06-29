/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import usePoller from "./Poller";

const DEBUG = false;

export default function useContractReader(
  contract: Contract,
  functionName: string,
  args?: any[],
  pollTime?: number,
  formatter?: (...args: any[]) => any,
  onChange?: (newValue: any) => void,
): any {
  let adjustPollTime = 3777;

  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof args === "number") {
    // it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args;
  }

  const [value, setValue] = useState<any>();
  useEffect(() => {
    if (typeof onChange === "function") {
      setTimeout(() => onChange(value), 1);
    }
  }, [value, onChange]);

  usePoller(() => {
    const readContractValue = async () => {
      try {
        let newValue;
        if (DEBUG) console.log("CALLING ", functionName, "with args", args);
        if (args && args.length > 0) {
          newValue = await contract[functionName](...args);
          if (DEBUG) {
            console.log("functionName", functionName, "args", args, "RESULT:", newValue);
          }
        } else {
          newValue = await contract[functionName]();
        }
        // perform any processing on the raw response
        if (formatter && typeof formatter === "function") {
          newValue = formatter(newValue);
        }

        if (newValue !== value) {
          setValue(newValue);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (contract && typeof contract[functionName] !== "undefined") readContractValue();
  }, adjustPollTime);

  return value;
}
