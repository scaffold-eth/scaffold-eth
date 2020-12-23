import { useState } from "react";
import { usePoller } from "eth-hooks";
import axios from "axios";

/*
  ~ What it does? ~

  Gets ETH gas price from https://ethgasstation.info/

  ~ How can I use? ~

  const gasPrice = useGasPrice("fast");

  ~ Features ~

  - Provide a different speed instead of "fast" and get corresponding gas price
                                          (ex. "fastest", "safeLow", "average")
  - 1000000000 for xdai

*/

export default function useGasPrice(speed) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    axios
      .get("https://ethgasstation.info/json/ethgasAPI.json")
      .then(response => {
        const newGasPrice = response.data[speed || "fast"] * 100000000;
        if (newGasPrice !== gasPrice) {
          setGasPrice(newGasPrice);
        }
      })
      .catch(error => console.log(error));
  };
  usePoller(loadGasPrice, 39999);
  return gasPrice;
}
