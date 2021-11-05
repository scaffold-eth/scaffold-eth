import { useState, useEffect } from "react";
import usePoller from "./Poller";

const DEBUG = false;

export default function useCurrentPlayerReader(
  contracts,
  contractName,
  functionName,
  args,
  isGameOn,
  playerCount,
  currentIndex,
  showNextPlayer,
  pollTime,
  formatter,
  onChange
) {
  let adjustPollTime = 2000;
  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof args === "number") {
    // it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args;
  }
  console.log("currentIndex", currentIndex && currentIndex.toNumber() , "playerCount", playerCount && playerCount.toNumber(), "args", args);
  const [value, setValue] = useState();
  useEffect(() => {
    if (typeof onChange === "function") {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value, onChange]);

  usePoller(
    async () => {
      if (playerCount && args[0] < playerCount.toNumber() && contracts && contracts[contractName] && isGameOn === true) {
        try {
          let newValue;
          if (DEBUG)
            console.log(
              "CALLING ",
              contractName,
              functionName,
              "with args",
              args
            );
          if (args && args.length > 0) {
            newValue = await contracts[contractName][functionName](...args);
            if (DEBUG)
              console.log(
                "contractName",
                contractName,
                "functionName",
                functionName,
                "args",
                args,
                "RESULT:",
                newValue
              );
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
      } else {
        setValue(null);
      }
    },
    adjustPollTime,
    contracts && contracts[contractName]
  );

  return value;
}
