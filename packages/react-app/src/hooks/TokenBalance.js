import { useState } from "react";
import usePoller from "./Poller.js";
import { ethers } from "ethers";
export default function useTokenBalance(
  contracts,
  tokenContractName,
  address,
  provider,
  pollTime
) {
  const [balance, setBalance] = useState(0);
  const pollBalance = async () => {
    if (address && provider && contracts) {
      try {
        const newBalance = await contracts[tokenContractName].balanceOf(
          address
        );
        if (newBalance !== balance) {
          setBalance(newBalance);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  usePoller(pollBalance, pollTime ? pollTime : 777);

  return balance;
}
