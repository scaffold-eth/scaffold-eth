/* eslint-disable no-underscore-dangle */
import { JsonRpcProvider } from '@ethersproject/providers'
import { INFURA_ID } from '../constants'

export default function getMainnetProvider() {
  // TODO: turn this back on?
  // const scaffoldEthProvider = new JsonRpcProvider('https://rpc.scaffoldeth.io:48544')
  const scaffoldEthProvider = null

  const mainnetInfura = new JsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID)

  const mainnetProvider =
    scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura

  return mainnetProvider
}
