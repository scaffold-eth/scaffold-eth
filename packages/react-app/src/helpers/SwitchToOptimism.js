const { ethers } = require('ethers')

export async function switchToOptimism() {
  const chainId = 0x0a
  const correctHexChainId = ethers.utils.hexValue(chainId)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: correctHexChainId }],
    })
    console.log(`Switch Network successful to chainId ${correctHexChainId}`)
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        console.log(`Retrying because of error ${switchError.code}`)
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

async function switchEthereumChain(correctHexChainId) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: correctHexChainId }],
  })
}

export async function switchToGoerli() {
  const chainId = 0x5
  const correctHexChainId = ethers.utils.hexValue(chainId)
  try {
    await switchEthereumChain(correctHexChainId)
    console.log(`Switch Network successful to chainId ${correctHexChainId}`)
  } catch (switchError) {
    if (switchError.code === 4902) {
      console.log(`Retrying because of error ${switchError.code}`)
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: correctHexChainId,
              chainName: 'Görli',
              rpcUrls: ['https://rpc.goerli.mudit.blog', 'https://rpc.ankr.com/eth_goerli'],
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
