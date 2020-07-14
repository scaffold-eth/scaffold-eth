import { useState } from 'react';
import usePoller from "./Poller.js";
import axios from 'axios';
export default function useGasPrice(speed) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(function (response) {
      let newGasPrice = response.data[speed?speed:"fast"]*100000000
      if(newGasPrice!==gasPrice){
        setGasPrice(newGasPrice);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
  usePoller(loadGasPrice,39999)
  return gasPrice
}
