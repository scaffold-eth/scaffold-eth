import { useState, useEffect } from "react";
import useBlockNumber from "./BlockNumber";

export default function useTimestamp(provider, pollTime) {
  const blockNumber = useBlockNumber(provider, pollTime);

  const [timestamp, setTimestamp] = useState();

  useEffect(() => {
    if (typeof provider !== "undefined") {
      // eslint-disable-next-line no-inner-declarations
      async function getTimestamp() {
        const nextBlock = await provider.getBlock(blockNumber);
        if (typeof nextBlock !== "undefined" && nextBlock && nextBlock.timestamp) {
          const nextTimestamp = nextBlock.timestamp;
          if (nextTimestamp !== timestamp) {
            setTimestamp(nextTimestamp);
          }
        }
      }
      getTimestamp();
    }
  }, [provider, blockNumber, timestamp]);

  return timestamp;
}
