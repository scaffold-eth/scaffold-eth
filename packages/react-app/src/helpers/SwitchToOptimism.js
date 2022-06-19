const { ethers } = require('ethers')

export async function switchToOptimism() {
  // console.log('switching to optimism net')
  const chainId = 0x0a
  const correctHexChainId = ethers.utils.hexValue(chainId)
  // console.log({ correctHexChainId })
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: correctHexChainId }],
    })
    // console.log({ switchRequest: result })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      // console.log('optimism chain has not been added to metamask yet!')
      try {
        // console.log('adding optimism to metamask')
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: correctHexChainId,
              chainName: 'Optimism',
              rpcUrls: ['https://mainnet.optimism.io', 'https://optimism-mainnet.public.blastapi.io'],
            },
          ],
        })
        // console.log('switch was successful')
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: correctHexChainId }],
        })
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}
