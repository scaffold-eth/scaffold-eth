import { Token, WETH, Fetcher, Route } from '@uniswap/sdk';
import { useState } from 'react';

import { useOnBlock, usePoller } from '~~';
import { TNetwork } from '~~/models';
import { TEthHooksProvider } from '~~/models/providerTypes';

export const useExchangePrice = (
  targetNetwork: TNetwork,
  mainnetProvider: TEthHooksProvider,
  pollTime: number = 0
): number => {
  const [price, setPrice] = useState(0);

  const pollPrice = (): void => {
    const getPrice = async (): Promise<void> => {
      if (!mainnetProvider) {
        return;
      } else if (targetNetwork.price) {
        setPrice(targetNetwork.price);
      } else {
        const network = await mainnetProvider.getNetwork();

        const DAI = new Token(network ? network.chainId : 1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18);
        const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], mainnetProvider);
        const route = new Route([pair], WETH[DAI.chainId]);
        setPrice(parseFloat(route.midPrice.toSignificant(6)));
      }
    };

    void getPrice();
  };

  useOnBlock(mainnetProvider, (): void => {
    if (pollTime === 0) pollPrice();
  });

  usePoller((): void => {
    if (pollTime > 0) pollPrice();
  }, pollTime);

  return price;
};
