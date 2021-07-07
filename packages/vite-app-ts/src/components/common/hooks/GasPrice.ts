import axios from 'axios';
import { useState } from 'react';
import { usePoller } from '.';

type TGasStationSpeed = 'slow' | 'fast' | 'fastest' | 'average';

/**
 * Gets the gast price from Eth Gast Station
 * @param targetNetwork
 * @param speed 'slow' | 'fast' | 'fastest' | 'average'
 * @param pollTime
 * @returns
 */
export function useGasPrice(targetNetwork: any, speed: TGasStationSpeed, pollTime: number = 39999) {
  const [gasPrice, setGasPrice] = useState<number>();

  const loadGasPrice = async () => {
    if (targetNetwork.hasOwnProperty('gasPrice')) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      if (navigator.onLine) {
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
    }
  };

  usePoller(loadGasPrice, pollTime);
  return gasPrice;
}
