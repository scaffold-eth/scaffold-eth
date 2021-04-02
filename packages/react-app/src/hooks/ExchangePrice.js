import { useState } from 'react'
import { Token, WETH, Fetcher, Route } from '@uniswap/sdk'
import { usePoller } from 'eth-hooks'

export default function useExchangePrice(targetNetwork, mainnetProvider, pollTime) {
  const [price, setPrice] = useState(0)

  const pollPrice = () => {
    async function getPrice() {
      if (targetNetwork && targetNetwork.price && targetNetwork.price.indexOf('uniswap') >= 0) {
        const DAI = new Token(
          mainnetProvider.network ? mainnetProvider.network.chainId : 1,
          '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          18,
        )
        const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], mainnetProvider)
        const route = new Route([pair], WETH[DAI.chainId])
        const priceOfETHinDAI = parseFloat(route.midPrice.toSignificant(6))
        let contractAddress = targetNetwork.price.replace('uniswap', '')
        contractAddress = contractAddress.replace(':', '')
        if (contractAddress) {
          const TOKEN = new Token(mainnetProvider.network ? mainnetProvider.network.chainId : 1, contractAddress, 18)
          const pair = await Fetcher.fetchPairData(WETH[TOKEN.chainId], TOKEN, mainnetProvider)
          const route = new Route([pair], TOKEN)
          const price = parseFloat(route.midPrice.toSignificant(6) * priceOfETHinDAI)
          setPrice(price)
        } else {
          setPrice(priceOfETHinDAI)
        }
      } else if (targetNetwork.price) {
        setPrice(targetNetwork.price)
      } else {
        setPrice(0)
      }
    }
    if (targetNetwork.price && !targetNetwork.price.indexOf) {
      setPrice(targetNetwork.price)
    } else {
      getPrice()
    }
  }
  usePoller(pollPrice, pollTime || 37777)

  return price
}
