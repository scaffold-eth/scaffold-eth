import axios from "axios";
import { usePoller } from "eth-hooks";
import { useState } from "react";
import { ETHERSCAN_KEY } from "../constants";

export default function useGasPrice(targetNetwork, speed, pollTime = 39999) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    if (targetNetwork.hasOwnProperty("gasPrice")) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      axios
        .get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + ETHERSCAN_KEY)
        .then(response => {
          console.log("response gas: ", response);
          const newGasPrice = response.data.result[speed || "FastGasPrice"] * 1000000000;
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch(error => console.log(error));
    }
  };

  usePoller(loadGasPrice, 39999);
  return gasPrice;
}
