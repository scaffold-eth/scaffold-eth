import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { useState } from 'react';

import { useOnBlock, usePoller } from '.';

/**
 * Get the balance of an ERC20 token in an address
 * 
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param contract contract object for the ERC20 token
 * @param address
 * @param pollTime
 * @returns
 */
const useTokenBalance = (contract: Contract, address: string, pollTime: number = 0): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const pollBalance = async (): Promise<void> => {
    if (contract != undefined) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const newBalance = await contract.balanceOf(address);
        if (newBalance !== balance) {
          setBalance(newBalance);
        }
      } catch (e) {
        console.log('⚠ Could not get token balance', e);
      }
    }
  };

  useOnBlock(contract && contract.provider, (): void => {
    if (address && pollTime === 0) {
      void pollBalance();
    }
  });

  usePoller((): void => {
    if (address && pollTime > 0) {
      void pollBalance();
    }
  }, pollTime);

  return balance;
};

export default useTokenBalance;
