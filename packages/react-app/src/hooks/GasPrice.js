import { useState } from "react";
import axios from "axios";
import usePoller from "./Poller";

export default function useGasPrice(speed) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    axios
      .get("https://ethgasstation.info/json/ethgasAPI.json")
      .then(response => {
        const newGasPrice = response.data[speed || "fast"] * 10000000;
        if (newGasPrice !== gasPrice) {
          setGasPrice(newGasPrice);
        }
      })
      .catch(error => console.log(error));
  };
  usePoller(loadGasPrice, 39999);
  return gasPrice;
}
