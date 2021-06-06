/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { JsonRpcProvider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'

// a function to check your balance on every network and switch networks if found...
const checkBalancesAndSwitchNetwork = async (NETWORKS, address) => {
  for (const n in NETWORKS) {
    const tempProvider = new JsonRpcProvider(NETWORKS[n].rpcUrl)
    // eslint-disable-next-line no-await-in-loop
    const tempBalance = await tempProvider.getBalance(address)
    const result = tempBalance && formatEther(tempBalance)
    if (result !== 0) {
      console.log('Found a balance in ', n)
      window.localStorage.setItem('network', n)
      setTimeout(() => {
        window.location.reload()
      }, 1)
    }
  }
}

export default checkBalancesAndSwitchNetwork
