import { useState } from 'react';

import { usePoller, useOnBlock } from '~~/index';
import { TEthHooksProvider } from '~~/models';

/**
 * Get the current block number
 * @param provider
 * @param pollTime if greater than 0, update the blocknumber on an interval
 * @returns
 */
export const useBlockNumber = (provider: TEthHooksProvider, pollTime: number = 0): number => {
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const getBlockNumber = async (): Promise<void> => {
    const nextBlockNumber = await provider.getBlockNumber();
    if (nextBlockNumber !== blockNumber) {
      setBlockNumber(nextBlockNumber);
    }
  };

  useOnBlock(provider, (): void => {
    if (pollTime === 0) void getBlockNumber();
  });

  usePoller((): void => {
    if (pollTime > 0) void getBlockNumber();
  }, pollTime);

  return blockNumber;
};
