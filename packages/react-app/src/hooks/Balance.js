import { useState, useEffect, useCallback } from "react";
import usePoller from "./Poller";

/*
  ~ What it does? ~

  Gets your balance in ETH from given address and provider

  ~ How can I use? ~

  const yourLocalBalance = useBalance(localProvider, address);

  ~ Features ~

  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
*/

export default function useBalance(provider, address) {

const [balance, setBalance] = useState();

const pollBalance = useCallback(async (provider, address) => {
  if (provider && address) {
    const newBalance = await provider.getBalance(address);
    if (newBalance !== balance) {
      setBalance(newBalance);
    }
  }
}, [provider, address]);

useEffect(() => {
  if (provider && address) {
    pollBalance(provider, address);

    const listener = (blockNumber) => {
      pollBalance(provider, address);
    }

    provider.on("block", listener)
    return () => {
      provider.off("block", listener)
  }
}
},[provider, address])

return balance;
}
