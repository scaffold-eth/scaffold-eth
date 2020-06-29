import { useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Provider } from "@ethersproject/providers";
import usePoller from "./Poller";

const useBalance = (provider: Provider, address: string, pollTime: number = 777): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  usePoller(() => {
    const pollBalance = async (): Promise<void> => {
      const newBalance = await provider.getBalance(address);
      if (newBalance !== balance) setBalance(newBalance);
    };

    if (address && provider) pollBalance();
  }, pollTime);

  return balance;
};

export default useBalance;
