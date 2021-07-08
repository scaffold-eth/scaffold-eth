import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useState, useCallback } from 'react';

import { usePoller, useOnBlock } from '.';

import { TEthHooksProvider } from '~~/models';

/**
 * Gets your balance in ETH from given address and provider
 *   
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param provider 
 * @param address 
 * @param pollTime 
 * @returns 
 */
export const useBalance = (
  provider: TEthHooksProvider | undefined,
  address: string,
  pollTime: number = 0
): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const pollBalance = useCallback(
    async (provider?: JsonRpcProvider | Web3Provider | undefined, address?: string): Promise<void> => {
      if (provider && address) {
        const newBalance = await provider.getBalance(address);
        if (newBalance !== balance) {
          setBalance(newBalance);
        }
      }
    },
    [balance]
  );

  // Only pass a provider to watch on a block if there is no pollTime
  useOnBlock(pollTime === 0 ? provider : undefined, () => {
    if (address != undefined && pollTime === 0) void pollBalance(provider, address);
  });

  // Use a poller if a pollTime is provided
  usePoller(
    (): void => {
      if (address != undefined && pollTime > 0) void pollBalance(provider, address);
    },
    pollTime,
    provider != undefined && address != undefined
  );

  return balance;
};
