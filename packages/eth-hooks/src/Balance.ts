import { useState, useEffect, useCallback } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider, Provider } from "@ethersproject/providers";
import usePoller from "./Poller";
import useOnBlock from "./OnBlock";

let DEBUG = false

const useBalance = (
  provider: Provider,
  address: string,
  pollTime: number = 0
): BigNumber => {

  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const pollBalance = useCallback(async (provider, address) => {
    if (provider && address) {
      const newBalance = await provider.getBalance(address);
      if (newBalance !== balance) {
        setBalance(newBalance);
      }
    }
  }, [provider, address]);

  // Only pass a provider to watch on a block if there is no pollTime
  useOnBlock(provider, () => {
    if (provider && address && pollTime === 0) {
      pollBalance(provider, address);
    }
  });

  // Update balance when the address or provider changes
  useEffect(() => {
    if (address && provider) pollBalance(provider, address);
  }, [address, provider, pollBalance]);

  // Use a poller if a pollTime is provided
  usePoller(async () => {
    if (provider && address && pollTime > 0) {
      if (DEBUG) console.log('polling!', address);
      pollBalance(provider, address);
    }
  }, pollTime, provider && address)

  return balance;
  };

export default useBalance;
