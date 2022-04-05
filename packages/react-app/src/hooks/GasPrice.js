import axios from "axios";
import { usePoller } from "eth-hooks";
import { useState } from "react";
import { ETHERSCAN_KEY } from "../constants";
import { ethers } from "ethers";

export default function useGasPrice(targetNetwork, speed) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      axios
        .get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + ETHERSCAN_KEY)
        .then(response => {
          const newGasPrice = ethers.utils.parseUnits(response.data.result["SafeGasPrice"], "gwei")
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch(error => console.log(error));
    }
  };

  usePoller(loadGasPrice, 4200);
  return gasPrice;
}
