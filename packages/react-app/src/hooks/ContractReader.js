import { useState, useEffect } from "react";
import usePoller from "./Poller";

const DEBUG = false;

/*
  ~ What it does? ~

  Enables you to read values from contracts and keep track of them in the local React states

  ~ How can I use? ~

  const purpose = useContractReader(readContracts,"YourContract", "purpose")

  ~ Features ~

  - Provide readContracts by loading contracts (see more on ContractLoader.js)
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the name of the variable in the contract, in this case we keep track of "purpose" variable
*/

export default function useContractReader(contracts, contractName, functionName, args, pollTime, formatter, onChange) {
  let adjustPollTime = 1777;
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

  usePoller(async () => {
    if (contracts && contracts[contractName]) {
      try {
        let newValue;
        if (DEBUG) console.log("CALLING ", contractName, functionName, "with args", args);
        if (args && args.length > 0) {
          newValue = await contracts[contractName][functionName](...args);
          if (DEBUG)
            console.log("contractName", contractName, "functionName", functionName, "args", args, "RESULT:", newValue);
        } else {
          newValue = await contracts[contractName][functionName]();
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
  }, adjustPollTime, contracts && contracts[contractName]);

  return value;
}
