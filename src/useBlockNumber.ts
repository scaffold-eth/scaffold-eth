import { Web3Provider } from '@ethersproject/providers';
import { useState } from 'react';

import { usePoller, useOnBlock } from '.';

const useBlockNumber = (provider: Web3Provider, pollTime: number = 0): number => {
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const getBlockNumber = async (): Promise<void> => {
    const nextBlockNumber = await provider.getBlockNumber();
    if (nextBlockNumber !== blockNumber) {
      setBlockNumber(nextBlockNumber);
    }
  };

  useOnBlock(provider, (): void => {
    if (typeof provider !== 'undefined' && pollTime === 0) {
      void getBlockNumber();
    }
  });

  usePoller((): void => {
    if (typeof provider !== 'undefined' && pollTime > 0) {
      void getBlockNumber();
    }
  }, pollTime);

  return blockNumber;
};

export default useBlockNumber;
