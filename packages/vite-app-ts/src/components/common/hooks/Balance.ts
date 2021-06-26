import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';
import { usePoller, useOnBlock } from '~~/components/common/hooks';
/*
  ~ What it does? ~

  Gets your balance in ETH from given address and provider

  ~ How can I use? ~

  const yourLocalBalance = useBalance(localProvider, address);

  ~ Features ~

  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
*/

const DEBUG = false;

export const useBalance = (
  provider: JsonRpcProvider | Web3Provider | undefined,
  address: string,
  pollTime: number = 0
) => {
  const [balance, setBalance] = useState<BigNumber>();

  const pollBalance = useCallback(
    async (provider?: JsonRpcProvider | Web3Provider | undefined, address?: string) => {
      if (provider && address) {
        const newBalance = await provider.getBalance(address);
        if (newBalance !== balance) {
          setBalance(newBalance);
        }
      }
    },
    [provider, address]
  );

  // Only pass a provider to watch on a block if there is no pollTime
  useOnBlock(pollTime === 0 ? provider : undefined, () => {
    if (provider && address && pollTime === 0) {
      pollBalance(provider, address);
    }
  });

  // Use a poller if a pollTime is provided
  usePoller(
    async () => {
      if (provider && address && pollTime > 0) {
        if (DEBUG) console.log('polling!', address);
        pollBalance();
      }
    },
    pollTime,
    provider != null && address != null
  );

  return balance;
};
