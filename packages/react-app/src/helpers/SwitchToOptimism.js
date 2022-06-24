const { ethers } = require('ethers')

export async function switchToOptimism() {
  const chainId = 0x0a
  const correctHexChainId = ethers.utils.hexValue(chainId)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: correctHexChainId }],
    })
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
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
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: correctHexChainId }],
        })
      } catch (addError) {}
    }
  }
}

export async function getNetworkChainList() {
  try {
    const data = await (await fetch('https://chainid.network/chains.json')).json()
    console.log({ data })
    return data
  } catch (error) {}
}

export async function getCurrentChainId() {
  let networkList
  try {
    networkList = await getNetworkChainList()
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const netResult = await ethers.providers.getNetwork(Number(chainId))
    const result = networkList.filter(net => net.chainId === netResult.chainId)
    return result
  } catch (error) {}
}
