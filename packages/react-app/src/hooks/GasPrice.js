import { useState } from 'react';
import usePoller from "./Poller.js";
import axios from 'axios';
export default function useGasPrice(speed) {
  const [gasPrice, setGasPrice] = useState();
  const loadGasPrice = async () => {
    axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(function (response) {

      let newGasPrice
      if(speed==="fastest"){
        newGasPrice = response.data.fastest*0.1
      }else if(speed==="fast"){
        newGasPrice = response.data.fast*0.01
      }else if(speed==="average"){
        newGasPrice = response.data.average*0.001
      }else if(speed==="slow"){
        newGasPrice = response.data.safeLow*0.0001
      }else{
        newGasPrice = response.data.fast*0.1
      }

      if(newGasPrice!==gasPrice){
        //console.log("GAS ",newGasPrice,"gwei")
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
