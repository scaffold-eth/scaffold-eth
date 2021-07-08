import { useState } from "react";
import axios from "axios";
import usePoller from "./Poller";

export default function useGasPrice(
  targetNetwork: any,
  speed: string,
  pollTime: number = 39999
) {
  const [gasPrice, setGasPrice] = useState<number>();

  const loadGasPrice = async () => {
    if(targetNetwork.hasOwnProperty("gasPrice")){
      setGasPrice(targetNetwork.gasPrice);
    } else {
      if(navigator.onLine){
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
    }
  };

  usePoller(loadGasPrice, pollTime);
  return gasPrice;
}
