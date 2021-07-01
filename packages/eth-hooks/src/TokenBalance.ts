import { useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import usePoller from "./Poller";
import useOnBlock from "./OnBlock";

const useTokenBalance = (
  contract: Contract,
  address: string,
  pollTime: number = 0
): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

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

  useOnBlock(
    contract && contract.provider,
    (): void => {
      if (address && contract && pollTime === 0) {
        pollBalance();
      }
    }
  );

  usePoller((): void => {
    if (address && contract && pollTime > 0) {
      pollBalance();
    }
  }, pollTime);

  return balance;
};

export default useTokenBalance;
