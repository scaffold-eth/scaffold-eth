import { useState } from "react";
import { usePoller } from ".";
import { ethers } from "ethers";
import { MAINNET_ID, addresses, abis } from "@uniswap-v1-app/contracts";

export default function useExchangePrice(mainnetProvider, pollTime) {
  const [price, setPrice] = useState(0);

  const pollPrice = () => {
    async function getPrice() {
      const ethDaiExchangeContract = new ethers.Contract(
        addresses[MAINNET_ID].exchanges["ETH-DAI"],
        abis.exchange,
        mainnetProvider
      );
      const exchangeRate = await ethDaiExchangeContract.getEthToTokenInputPrice(
        "10000000000000000000"
      );
      setPrice(parseFloat(exchangeRate.div("100000000000000000")) / 100);
    }
    getPrice();
  };
  usePoller(pollPrice, pollTime ? pollTime : 9777);

  return price;
}
