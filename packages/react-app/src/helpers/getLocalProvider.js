import { JsonRpcProvider } from '@ethersproject/providers'
import getTargetNetwork from './getTargetNetwork'

export default function getLocalProvider() {
  const targetNetwork = getTargetNetwork()

  // 🏠 Your local provider is usually pointed at your local blockchain
  const localProviderUrl = targetNetwork.rpcUrl
  // as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER
    ? process.env.REACT_APP_PROVIDER
    : localProviderUrl
  const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)

  return localProvider
}
