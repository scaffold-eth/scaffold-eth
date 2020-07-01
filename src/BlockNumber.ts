import { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import usePoller from "./Poller";
import { BLOCK_TIME } from "./constants";

const useBlockNumber = (provider: Web3Provider, pollTime: number = BLOCK_TIME / 2): number => {
  const [blockNumber, setBlockNumber] = useState<number>(0);

  usePoller((): void => {
    const getBlockNumber = async (): Promise<void> => {
      const nextBlockNumber = await provider.getBlockNumber();
      if (nextBlockNumber !== blockNumber) {
        setBlockNumber(nextBlockNumber);
      }
    };

    if (typeof provider !== "undefined") getBlockNumber();
  }, pollTime);

  return blockNumber;
};

export default useBlockNumber;
