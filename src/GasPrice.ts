import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

import { usePoller } from '.';

import { TNetwork } from '~~/models';

/**
 * Preset speeds for Eth Gas Station
 */
export type TGasStationSpeed = 'slow' | 'fast' | 'fastest' | 'average';

/**
 * Gets the gas price from Eth Gas Station
 * @param targetNetwork
 * @param speed 'slow' | 'fast' | 'fastest' | 'average'
 * @param pollTime
 * @returns
 */
const useGasPrice = (
  targetNetwork: TNetwork,
  speed: TGasStationSpeed,
  pollTime: number = 39999
): number | undefined => {
  const multiplier = 100000000;
  const [gasPrice, setGasPrice] = useState<number | undefined>();

  const loadGasPrice = () => {
    if (targetNetwork?.gasPrice) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      if (navigator.onLine) {
        axios
          .get('https://ethgasstation.info/json/ethgasAPI.json')
          .then((response: AxiosResponse<any>) => {
            const result: Record<string, any> = response.data ?? {};
            let newGasPrice: number | undefined = result[speed] * multiplier;
            if (!newGasPrice) newGasPrice = result['fast'] * multiplier;
            if (newGasPrice !== gasPrice) {
              setGasPrice(newGasPrice);
            }
          })
          .catch((error) => {
            console.log('⚠ Could not get gas Price!', error);
            setGasPrice(undefined);
          });
      }
    }
  };

  usePoller(loadGasPrice, pollTime);
  return gasPrice;
};

export default useGasPrice;
