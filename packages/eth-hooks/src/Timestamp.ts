import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import useBlockNumber from "./BlockNumber";

const useTimestamp = (provider: Web3Provider, pollTime?: number): number => {
  const blockNumber = useBlockNumber(provider, pollTime);

  const [timestamp, setTimestamp] = useState<number>(0);

  useEffect((): void => {
    const getTimestamp = async (): Promise<void> => {
      const nextBlock = await provider.getBlock(blockNumber);
      if (typeof nextBlock !== "undefined" && nextBlock && nextBlock.timestamp) {
        const nextTimestamp = nextBlock.timestamp;
        if (nextTimestamp !== timestamp) {
          setTimestamp(nextTimestamp);
        }
      }
    };

    if (typeof provider !== "undefined") getTimestamp();
  }, [blockNumber, provider, timestamp]);

  return timestamp;
};

export default useTimestamp;
