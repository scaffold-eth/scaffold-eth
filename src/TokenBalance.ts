import { useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import usePoller from "./Poller";
import { BLOCK_TIME } from "./constants";

const useTokenBalance = (contract: Contract, address: string, pollTime: number = 2 * BLOCK_TIME): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  usePoller((): void => {
    const pollBalance = async (): Promise<void> => {
      try {
        const newBalance = await contract.balanceOf(address);
        if (newBalance !== balance) {
          setBalance(newBalance);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };

    if (address && contract) pollBalance();
  }, pollTime);

  return balance;
};

export default useTokenBalance;
