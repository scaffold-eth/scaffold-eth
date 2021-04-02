/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import 'antd/dist/antd.css'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { Row, Col } from 'antd'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useUserAddress } from 'eth-hooks'
import { formatEther } from '@ethersproject/units'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import {
  usePoller,
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader
} from '../../hooks'
import {
  Wallet,
  AddressInput,
  EtherInput,
  Header,
  Account,
  Faucet,
  Ramp,
  GasGauge,
  ThemeSwitch,
  QRPunkBlockie,
  Address,
  Balance
} from '../../components'
import { Subgraph } from '..'
import configureStore from '../../redux/configureStore'
import { Transactor, checkBalancesAndSwitchNetwork } from '../../helpers'
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, getNetworkByChainId, NETWORKS } from '../../constants'
import {
  Background,
  Terminal,
  Wallet as WalletView,
  Toolbelt,
  Dish,
  DialogModal,
  NetworkSelectDropdown,
  NetworkSelectWarning,
  FaucetHint
} from './views'
import './index.css'

const { ethers } = require('ethers')

const store = configureStore()

/// 📡 What chain are your contracts deployed to?
const cachedNetwork = window.localStorage.getItem('network')
let targetNetwork = NETWORKS[cachedNetwork || 'ethereum'] // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
if (!targetNetwork) {
  targetNetwork = NETWORKS.ethereum
}

// TODO: turn this back on?
// const scaffoldEthProvider = new JsonRpcProvider('https://rpc.scaffoldeth.io:48544')
const scaffoldEthProvider = null
const mainnetInfura = new JsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER
  ? process.env.REACT_APP_PROVIDER
  : localProviderUrl
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer

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

window.ethereum &&
  window.ethereum.on('chainChanged', chainId => {
    setTimeout(() => {
      window.location.reload()
    }, 1)
  })

const App = props => {
  const mainnetProvider =
    scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura

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

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  const yourLocalBalance = useBalance(localProvider, address)

  const balance = yourLocalBalance && formatEther(yourLocalBalance)

  const yourMainnetBalance = useBalance(mainnetProvider, address)

  // if you don't have any money, scan the other networks for money
  usePoller(() => {
    if (!cachedNetwork) {
      if (balance === 0) {
        checkBalancesAndSwitchNetwork(address)
      }
    }
  }, 7777)
  setTimeout(() => {
    if (!cachedNetwork) {
      if (balance === 0) {
        checkBalancesAndSwitchNetwork(address)
      }
    }
  }, 1777)
  setTimeout(() => {
    if (!cachedNetwork) {
      if (balance === 0) {
        checkBalancesAndSwitchNetwork(address)
      }
    }
  }, 3777)

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

  const faucetHint = (
    <FaucetHint localProvider={localProvider} gasPrice={gasPrice} address={address} />
  )
  const faucetAvailable =
    localProvider &&
    localProvider.connection &&
    localProvider.connection.url &&
    localProvider.connection.url.indexOf('localhost') >= 0 &&
    !process.env.REACT_APP_PROVIDER &&
    price > 1

  let startingAddress = ''
  if (window.location.pathname) {
    const incoming = window.location.pathname.replace('/', '')
    if (incoming && ethers.utils.isAddress(incoming)) {
      startingAddress = incoming
      window.history.pushState({}, '', '/')
    }
  }
  console.log('startingAddress', startingAddress)

  const [amount, setAmount] = useState()
  const [toAddress, setToAddress] = useState(startingAddress)

  const [loading, setLoading] = useState(false)

  const gotWeb3Provider = web3Modal && web3Modal.cachedProvider

  let walletDisplay = ''
  if (gotWeb3Provider) {
    walletDisplay = (
      <Wallet
        address={address}
        provider={userProvider}
        ensProvider={mainnetProvider}
        price={price}
      />
    )
  }

  return (
    <ReduxProvider store={store} key='reduxProvider'>
      <div className='App'>
        <Background />

        <DialogModal />

        <Terminal />

        <WalletView />

        <Dish />

        <Toolbelt />

        {networkSelectWarning}
        <div className='site-page-header-ghost-wrapper'>
          <Header
            extra={[
              <Address
                fontSize={20}
                address={address}
                ensProvider={mainnetProvider}
                blockExplorer={blockExplorer}
              />,
              walletDisplay,
              <Balance value={yourLocalBalance} fontSize={20} price={price} />,
              <span style={{ verticalAlign: 'middle' }}>{networkSelect}</span>,
              <Account
                address={address}
                localProvider={localProvider}
                userProvider={userProvider}
                mainnetProvider={mainnetProvider}
                price={price}
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
                blockExplorer={blockExplorer}
              />
            ]}
          />
        </div>

        <div
          style={{
            clear: 'both',
            opacity: yourLocalBalance ? 1 : 0.2,
            width: 500,
            margin: 'auto'
          }}
        >
        </div>

        {/*
        <BrowserRouter>
          <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
            <Menu.Item key="/">
              <Link onClick={()=>{setRoute("/")}} to="/">YourContract</Link>
            </Menu.Item>
            <Menu.Item key="/hints">
              <Link onClick={()=>{setRoute("/hints")}} to="/hints">Hints</Link>
            </Menu.Item>
            <Menu.Item key="/exampleui">
              <Link onClick={()=>{setRoute("/exampleui")}} to="/exampleui">ExampleUI</Link>
            </Menu.Item>
            <Menu.Item key="/mainnetdai">
              <Link onClick={()=>{setRoute("/mainnetdai")}} to="/mainnetdai">Mainnet DAI</Link>
            </Menu.Item>
            <Menu.Item key="/subgraph">
              <Link onClick={()=>{setRoute("/subgraph")}} to="/subgraph">Subgraph</Link>
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
            <Route path="/hints">
              <Hints
                address={address}
                yourLocalBalance={yourLocalBalance}
                mainnetProvider={mainnetProvider}
                price={price}
              />
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

        <div
          style={{
            position: 'fixed',
            textAlign: 'right',
            right: 0,
            bottom: 16,
            padding: 10
          }}
        >
          {faucetHint}
        </div>

        <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
          <Row align='middle' gutter={[16, 16]}>
            <Col span={12} style={{ textAlign: 'center', opacity: 0.8 }}>
              <GasGauge gasPrice={gasPrice} />
            </Col>
          </Row>

          <Row align='right' gutter={[4, 4]}>
            <Col span={12}>
              {faucetAvailable && (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </ReduxProvider>
  )
}

export default App
