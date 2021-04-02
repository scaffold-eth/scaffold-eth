/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Typist from 'react-typist'
import Typewriter from 'typewriter-effect/dist/core'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import $ from 'jquery'
import {
  INFURA_ID,
  DAI_ADDRESS,
  DAI_ABI,
  getNetworkByChainId,
  NETWORKS
} from '../../../../constants'
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
} from '../../../../hooks'
import { Transactor, checkBalancesAndSwitchNetwork } from '../../../../helpers'
import {
  Wallet as WalletView,
  Account,
  Faucet,
  GasGauge,
  Address,
  Balance,
  FaucetHint
} from './views'
import { mapStateToProps, mapDispatchToProps, reducer } from './controller'
import './styles.css'

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    right: '10px',
    // pointerEvents:'none',
    height: '511px',
    width: '303px',
    background: 'url(./assets/wallet_new.png)',
    backgroundSize: 'cover',
    cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer',
    imageRendering: 'pixelated',
    zIndex: 1050
  },
  walletClickableTop: {
    height: '145px',
    width: '303px'
  },
  walletContentContainer: {
    // marginTop: '145px',
    marginLeft: '45px',
    marginRight: '30px'
  },
  message: {
    color: 'white'
  }
}

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

const mainnetProvider =
  scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura

// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER
  ? process.env.REACT_APP_PROVIDER
  : localProviderUrl
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)

const Wallet = ({
  visible,
  actions,
  web3Modal,
  address,
  provider,
  ensProvider,
  price,
  loadWeb3Modal,
  logoutOfWeb3Modal
}) => {
  const toggleVisibility = () => {
    $('#wallet')
      .toggleClass('close')
      .promise()
      .done(() => {
        console.log('effect done')
      })
  }

  useEffect(() => {
    toggleVisibility()
  }, [visible])

  /*
  const activateConnectionSearchAnimation = () => {
    // eslint-disable-next-line no-new
    new Typewriter('#walletContentContainer > .message', {
      strings: ['Searching for network ...'],
      cursor: '',
      autoStart: true,
      loop: true,
      delay: 90, // delay between each key when typing
      deleteSpeed: 10
    })
  }

  useEffect(() => {
    activateConnectionSearchAnimation()
  }, [])
  */

  const gotWeb3Provider = web3Modal && web3Modal.cachedProvider

  let walletDisplay = ''
  if (gotWeb3Provider) {
    walletDisplay = (
      <WalletView address={address} provider={provider} ensProvider={ensProvider} price={price} />
    )
  }

  const gasPrice = useGasPrice(targetNetwork, 'fast')

  const yourLocalBalance = useBalance(localProvider, address)

  const balance = yourLocalBalance && formatEther(yourLocalBalance)

  const yourMainnetBalance = useBalance(mainnetProvider, address)

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer

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

  return (
    <div id='wallet' style={{ ...styles.container }}>
      <div
        id='walletClickableTop'
        style={{ ...styles.walletClickableTop }}
        onClick={() => {
          actions.toggleVisibility()
        }}
      />
      <div id='walletContentContainer' style={{ ...styles.walletContentContainer }}>
        {/*
        <div className='message' style={{ ...styles.message }}>
          <Typist cursor={{ show: false }} avgTypingDelay={50} loop />
        </div>
        */}

        {walletDisplay}

        <Balance value={yourLocalBalance} fontSize={20} price={price} />

        <div style={{ float: 'left', width: '100%' }}>
          <Address
            fontSize={20}
            size='short'
            color='white'
            address={address}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
          />
        </div>

        <div style={{ float: 'right' }}>
          <Account
            address={address}
            localProvider={localProvider}
            userProvider={provider}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
          />
        </div>

        <div style={{ position: 'absolute', bottom: 0, marginBottom: 70 }}>
          <GasGauge gasPrice={gasPrice} />
        </div>

        {faucetHint && (
          <div style={{ position: 'absolute', bottom: 120, marginRight: '29px' }}>{faucetHint}</div>
        )}

        {faucetAvailable && (
          <div style={{ position: 'absolute', bottom: 0, marginBottom: 29, marginRight: 29 }}>
            <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
          </div>
        )}
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)

export { reducer }
