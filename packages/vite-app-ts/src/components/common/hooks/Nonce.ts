import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useState } from 'react';

import { useOnBlock } from '.';
import { usePoller } from '.';

/**
 * Get the current nonce of the address provided
 * @param provider
 * @param address
 * @param pollTime
 * @returns
 */
export const useNonce = (provider: JsonRpcProvider | Web3Provider, address: string, pollTime: number = 0): number => {
  const [nonce, setNonce] = useState<number>(0);

  const getTransactionCount = async (): Promise<void> => {
    const nextNonce = await provider.getTransactionCount(address);
    if (nextNonce !== nonce) {
      setNonce(nextNonce);
    }
  };

  useOnBlock(provider, (): void => {
    if (pollTime === 0) void getTransactionCount();
  });

  usePoller((): void => {
    if (pollTime > 0) void getTransactionCount();
  }, pollTime);

  return nonce;
};
