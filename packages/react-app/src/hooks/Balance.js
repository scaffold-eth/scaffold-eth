import { useState } from "react";
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

export default function useBalance(provider, address, pollTime) {
  const [balance, setBalance] = useState();
  const pollBalance = async () => {
    if (address && provider) {
      const newBalance = await provider.getBalance(address);
      if (newBalance !== balance) {
        // console.log("NEW BALANCE:",newBalance,"Current balance",balance)
        setBalance(newBalance);
      }
    }
  };
  usePoller(pollBalance, 27777, address && provider);

  return balance;
}
