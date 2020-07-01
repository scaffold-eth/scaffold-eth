import { useState } from "react";
import { Provider } from "@ethersproject/providers";
import usePoller from "./Poller";
import { BLOCK_TIME } from "./constants";

const useNonce = (provider: Provider, address: string, pollTime: number = BLOCK_TIME / 2): number => {
  const [nonce, setNonce] = useState<number>(0);

  usePoller((): void => {
    const getTransactionCount = async (): Promise<void> => {
      const nextNonce = await provider.getTransactionCount(address);
      if (nextNonce !== nonce) {
        setNonce(nextNonce);
      }
    };

    if (typeof provider !== "undefined") getTransactionCount();
  }, pollTime);

  return nonce;
};

export default useNonce;
