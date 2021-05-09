import { NETWORKS } from '../constants'

export default function getTargetNetwork() {
  // 📡 What chain are your contracts deployed to?
  const cachedNetwork = window.localStorage.getItem('network')
  let targetNetwork = NETWORKS[cachedNetwork || 'ethereum'] // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
  if (!targetNetwork) {
    targetNetwork = NETWORKS.ethereum
  }

  return targetNetwork
}
