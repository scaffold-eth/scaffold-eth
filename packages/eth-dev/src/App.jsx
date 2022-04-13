import React, { useCallback, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Web3Provider } from '@ethersproject/providers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useUserAddress } from 'eth-hooks'
import './App.less'

import { useUserProvider } from './hooks'

import { getLocalProvider } from './helpers'
import { INFURA_ID, NETWORKS } from './constants'

import Levels from './components/levels'
import ProgressTrackerWindow from './components/levels/ProgressTrackerWindow'
import {
  NetworkSelectWarning,
  NetworkSelectDropdown
  // Toolbelt
} from './components/gameItems/components'

const { ethers } = require('ethers')

/*
// 📡 What chain are your contracts deployed to?
const cachedNetwork = window.localStorage.getItem('network')
let targetNetwork = NETWORKS[cachedNetwork || 'ethereum'] // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
if (!targetNetwork) {
  targetNetwork = NETWORKS.ethereum
}

// TODO: turn this back on?
// const scaffoldEthProvider = new StaticJsonRpcProvider('https://rpc.scaffoldeth.io:48544')
const scaffoldEthProvider = null
const mainnetInfura = new StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER
  ? process.env.REACT_APP_PROVIDER
  : localProviderUrl
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv)
// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer
*/

// Web3 modal helps us "connect" external wallets:
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID
      }
    }
  }
})

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider()
  setTimeout(() => {
    window.location.reload()
  }, 1)
}

// eslint-disable-next-line no-unused-expressions
window.ethereum &&
  window.ethereum.on('chainChanged', chainId => {
    setTimeout(() => {
      window.location.reload()
    }, 1)
  })

const App = props => {
  /*
  const mainnetProvider =
    scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura
  */
  let targetNetwork
  let mainnetProvider
  let localProvider

  // TODO: need to integrate this into the game with if-else clause
  //       depending on level status
  try {
    /*
    targetNetwork = getTargetNetwork()
    mainnetProvider = getMainnetProvider()
    */
    // TODO: get target network when user starts a local network
    localProvider = getLocalProvider()
  } catch (error) {
    console.error({ error })
  }

  const [injectedProvider, setInjectedProvider] = useState()
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  // const price = useExchangePrice(targetNetwork, mainnetProvider)
  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  // const gasPrice = useGasPrice(targetNetwork, 'fast')
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  // const userProvider = useUserProvider(injectedProvider, localProvider)
  // deactivate 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider)
  const address = useUserAddress(userProvider)
  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId

  // If you want to call a function on a new block
  /*
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`)
  })
  */

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  // const transactor = Transactor(userProvider, gasPrice)

  const networkSelectWarning = (
    <NetworkSelectWarning
      targetNetwork={targetNetwork}
      selectedChainId={selectedChainId}
      localChainId={localChainId}
    />
  )

  const networkSelect = (
    <NetworkSelectDropdown networkOptions={NETWORKS} targetNetwork={targetNetwork} />
  )

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  const [route, setRoute] = useState()
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute])

  let startingAddress = ''
  if (window.location.pathname) {
    const incoming = window.location.pathname.replace('/', '')
    if (incoming && ethers.utils.isAddress(incoming)) {
      startingAddress = incoming
      window.history.pushState({}, '', '/')
    }
  }

  return (
    <div id='app'>
      <Levels
        web3Modal={web3Modal}
        address={address}
        localProvider={localProvider}
        userProvider={userProvider}
        ensProvider={mainnetProvider}
        // price={price}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        networkSelect={networkSelect}
      />

      {/* <ProgressTrackerWindow isOpen /> */}

      {/* <Dish /> */}

      {/* <Toolbelt /> */}

      {/*
      {networkSelectWarning}

      <div className='site-page-header-ghost-wrapper'>
        <Header extra={[<span style={{ verticalAlign: 'middle' }}>{networkSelect}</span>]} />
      </div>
      */}
    </div>
  )
}

export default App
