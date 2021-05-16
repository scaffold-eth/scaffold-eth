import { useState } from "react";
import { Provider } from "@ethersproject/providers";
import usePoller from "./Poller";
import useOnBlock from "./OnBlock";

const useNonce = (
  provider: Provider,
  address: string,
  pollTime: number = 0
): number => {
  const [nonce, setNonce] = useState<number>(0);

  const getTransactionCount = async (): Promise<void> => {
    const nextNonce = await provider.getTransactionCount(address);
    if (nextNonce !== nonce) {
      setNonce(nextNonce);
    }
  };

  useOnBlock(
    provider,
    (): void => {
      if (typeof provider !== "undefined" && pollTime === 0) {
        getTransactionCount();
      }
    }
  );

  usePoller((): void => {
    if (typeof provider !== "undefined" && pollTime > 0) getTransactionCount();
  }, pollTime);

  return nonce;
};

export default useNonce;
