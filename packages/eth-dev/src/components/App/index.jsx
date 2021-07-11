/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import 'antd/dist/antd.css'
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useUserAddress } from 'eth-hooks'
import { formatEther } from '@ethersproject/units'

import {
  usePoller,
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader,
  useOnBlock
} from '../../hooks'
import { Subgraph } from '..'
import configureStore from '../../redux/configureStore'
import {
  getTargetNetwork,
  getLocalProvider,
  getMainnetProvider,
  Transactor,
  checkBalancesAndSwitchNetwork
} from '../../helpers'
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, getNetworkByChainId, NETWORKS } from '../../constants'

import LevelContainer from './gameItems/containers/level'
import Levels from './levels'
import {
  Terminal,
  Wallet as WalletView,
  Toolbelt,
  Dish,
  AddressInput,
  EtherInput,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkSelectWarning,
  NetworkSelectDropdown
} from './gameItems/components'

import './index.css'

const { ethers } = require('ethers')

const store = configureStore()

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

  const targetNetwork = getTargetNetwork()
  const mainnetProvider = getMainnetProvider()
  const localProvider = getLocalProvider()

  const [injectedProvider, setInjectedProvider] = useState()
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider)
  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, 'fast')
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider)
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
  const transactor = Transactor(userProvider, gasPrice)

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
  console.log('startingAddress', startingAddress)

  return (
    <ReduxProvider store={store} key='reduxProvider'>
      <div id='app'>
        <LevelContainer>
          <Levels />

          {/* <Terminal /> */}

          <WalletView
            web3Modal={web3Modal}
            address={address}
            localProvider={localProvider}
            userProvider={userProvider}
            ensProvider={mainnetProvider}
            price={price}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />

          {/* <Dish /> */}

          {/* <Toolbelt /> */}

          {networkSelectWarning}

          <div className='site-page-header-ghost-wrapper'>
            <Header extra={[<span style={{ verticalAlign: 'middle' }}>{networkSelect}</span>]} />
          </div>

          {/*
          <div
            style={{
              clear: 'both',
              opacity: yourLocalBalance ? 1 : 0.2,
              width: 500,
              margin: 'auto'
            }}
          />
          */}

          {/*
          <BrowserRouter>
            <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
              <Menu.Item key="/">
                <Link onClick={()=>{setRoute("/")}} to="/">YourContract</Link>
              </Menu.Item>

            </Menu>
            <Switch>
              <Route exact path="/">
                }
                <Contract
                  name="YourContract"
                  signer={userProvider.getSigner()}
                  provider={localProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />
              </Route>
              </Route>
              <Route path="/mainnetdai">
                <Contract
                  name="DAI"
                  customContract={mainnetDAIContract}
                  signer={userProvider.getSigner()}
                  provider={mainnetProvider}
                  address={address}
                  blockExplorer={"https://etherscan.io/"}
                />
              </Route>
              <Route path="/subgraph">
                <Subgraph
                subgraphUri={props.subgraphUri}
                tx={tx}
                writeContracts={writeContracts}
                mainnetProvider={mainnetProvider}
                />
              </Route>
            </Switch>
          </BrowserRouter>
          */}
        </LevelContainer>
      </div>
    </ReduxProvider>
  )
}

export default App
