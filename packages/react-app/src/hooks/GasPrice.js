import { useState } from "react";
import { usePoller } from "eth-hooks";
import axios from "axios";

export default function useGasPrice(targetNetwork,speed, pollTime) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    if(targetNetwork.gasPrice){
      setGasPrice(targetNetwork.gasPrice);
    }else{
      axios
        .get("https://ethgasstation.info/json/ethgasAPI.json")
        .then(response => {
          const newGasPrice = response.data[speed || "fast"] * 100000000;
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch(error => console.log(error));
    }
  };

  usePoller(loadGasPrice, pollTime || 39999);
  return gasPrice;
}
