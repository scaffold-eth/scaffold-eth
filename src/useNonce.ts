import { useState } from 'react';

import { useOnBlock, usePoller } from '~~';
import { TEthHooksProvider } from '~~/models';

/**
 * Get the current nonce of the address provided
 * @param provider
 * @param address
 * @param pollTime
 * @returns
 */
export const useNonce = (provider: TEthHooksProvider, address: string, pollTime: number = 0): number => {
  const [nonce, setNonce] = useState<number>(0);

  const getTransactionCount = async (): Promise<void> => {
    const nextNonce = await provider?.getTransactionCount(address);
    if (nextNonce !== nonce && nextNonce >= 0) {
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
