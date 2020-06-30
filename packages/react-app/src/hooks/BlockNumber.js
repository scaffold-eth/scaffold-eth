import { useState } from "react";
import usePoller from "./Poller";

export default function useBlockNumber(provider, pollTime) {
  const [blockNumber, setBlockNumber] = useState();

  usePoller(() => {
    if (typeof provider !== "undefined") {
      async function getBlockNumber() {
        const nextBlockNumber = await provider.getBlockNumber();
        if (nextBlockNumber !== blockNumber) {
          setBlockNumber(nextBlockNumber);
        }
      }
      getBlockNumber();
    }
  }, pollTime || 1777);

  return blockNumber;
}
