const { ethers } = require('ethers')

export const externalParams = {
  chainName: 'Optimism',
  decimalChain: 10,
  chainId: 0x0a,
  rpcUrls: ['https://opt-mainnet.g.alchemy.com/v2/cdGnPX6sQLXv-YWkbzYAXnTVVfuL8fhb'],
  testchainName: 'Görli',
  testdecimalChain: 5,
  testchainId: 0x5,
  testrpcUrls: ['https://eth-goerli.g.alchemy.com/v2/1fpzjlzdaT-hFeeTXFY-yzM-WujQLfEl'],
}

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

export async function switchNetworkChain(selectedChainId) {
  const hexChainId =
    selectedChainId === externalParams.decimalChain
      ? externalParams.chainId
      : selectedChainId === externalParams.testdecimalChain
      ? externalParams.testchainId
      : externalParams.chainId
  const correctHexChainId = ethers.utils.hexValue(hexChainId)
  if (selectedChainId === 10) {
    await switchToOptimism(correctHexChainId)
    return
  }
  if (selectedChainId === 5) {
    await switchToGoerli(correctHexChainId)
    return
  }
}

export async function switchToGoerli(correctHexChainId) {
  console.log({ correctHexChainId })
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
            chainName: externalParams[1].testchainName,
            rpcUrls: [...externalParams[1].testrpcUrls],
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

export async function switchToOptimism(correctHexChainId) {
  console.log({ correctHexChainId })
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
            chainName: externalParams.chainName,
            rpcUrls: [...externalParams.rpcUrls],
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
  } catch (error) {
    console.log({ error })
  }
}

export async function getCurrentChainId() {
  let networkList
  try {
    networkList = await getNetworkChainList()
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const netResult = await ethers.providers.getNetwork(Number(chainId))
    const result = networkList.filter(net => net.chainId === netResult.chainId)
    // console.log({ result })
    return result
  } catch (error) {
    console.log({ error })
  }
}
