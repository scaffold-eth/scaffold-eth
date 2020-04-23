import { useState } from 'react';
import { usePoller } from "eth-hooks";
import { ethers } from "ethers";
import { MAINNET_ID, addresses, abis } from "@uniswap-v1-app/contracts";

export default function useExchangePrice(mainnetProvider,pollTime) {

  const [price, setPrice] = useState(0);
  const pollPrice = async ()=>{
    const ethDaiExchangeContract = new ethers.Contract(
      addresses[MAINNET_ID].exchanges["ETH-DAI"],
      abis.exchange,
      mainnetProvider,
    );
    const exchangeRate = await ethDaiExchangeContract.getEthToTokenInputPrice("1000000000000000000");
  }
  usePoller(pollPrice,pollTime?pollTime:777)

  return price;
}
