import axios from 'axios';
import { usePoller } from 'eth-hooks';
import { useState } from 'react';
import { NetworkTypes } from '~~/models/NetworkTypes';

export const useGasPrice = (targetNetwork: NetworkTypes, speed: string) => {
  const [gasPrice, setGasPrice] = useState<number>();
  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      axios
        .get('https://ethgasstation.info/json/ethgasAPI.json')
        .then((response) => {
          const newGasPrice = response.data[speed || 'fast'] * 100000000;
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  usePoller(loadGasPrice, 39999);
  return gasPrice;
};
