const { ethers } = require('ethers')

export const externalParams = [
  {
    chainName: 'Optimism',
    chainId: 0x0a,
    blockExplorer: 'https://optimistic.etherscan.io/',
    rpcUrls: ['https://opt-mainnet.g.alchemy.com/v2/cdGnPX6sQLXv-YWkbzYAXnTVVfuL8fhb', 'https://mainnet.optimism.io'],
  },
  {
    chainName: 'Görli',
    chainId: 0x5,
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrls: ['https://eth-goerli.g.alchemy.com/v2/1fpzjlzdaT-hFeeTXFY-yzM-WujQLfEl', 'https://rpc.goerli.mudit.blog'],
  },
]

/**
 * @param {{chainName: string;chainId: number;rpcUrls: string[];}} switchPayload - An object
 */
export async function switchChain(switchPayload) {
  const chainId = switchPayload.chainId
  const chainName = switchPayload.chainName
  const chainUrls = switchPayload.rpcUrls
  const correctHexChainId = ethers.utils.hexValue(chainId)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: correctHexChainId }],
    })
    console.log(`Switch Network successful to chainId ${correctHexChainId}`)
  } catch (switchError) {
    try {
      console.log(`Retrying because of error ${switchError.code}`)
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: correctHexChainId,
            chainName: chainName,
            rpcUrls: [...chainUrls],
          },
        ],
      })
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: correctHexChainId }],
      })
    } catch (addError) {
      console.log({ addError })
    }
  }
}

export async function switchToGoerli() {
  const chainId = externalParams[1].chainId
  const correctHexChainId = ethers.utils.hexValue(chainId)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: correctHexChainId }],
    })
  } catch (switchError) {
    console.log({ switchError })
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: correctHexChainId,
            chainName: externalParams[1].chainName,
            rpcUrls: [...externalParams[1].rpcUrls],
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

export async function switchToOptimism() {
  const chainId = externalParams[0].chainId
  const correctHexChainId = ethers.utils.hexValue(chainId)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: correctHexChainId }],
    })
  } catch (switchError) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: correctHexChainId,
            chainName: externalParams[0].chainName,
            rpcUrls: [...externalParams[0].rpcUrls],
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

export async function getNetworkChainList() {
  try {
    const data = await (await fetch('https://chainid.network/chains.json')).json()
    // console.log({ data })
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
