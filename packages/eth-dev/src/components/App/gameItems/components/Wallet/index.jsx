/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal-resizable-draggable'
import Typist from 'react-typist'
import Typewriter from 'typewriter-effect/dist/core'
import shortid from 'shortid'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import $ from 'jquery'
import {
  INFURA_ID,
  DAI_ADDRESS,
  DAI_ABI,
  getNetworkByChainId,
  NETWORKS
} from '../../../../../constants'
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
} from '../../../../../hooks'
import { Transactor, checkBalancesAndSwitchNetwork } from '../../../../../helpers'
import {
  Wallet as WalletView,
  Account,
  Faucet,
  GasGauge,
  Address,
  Balance,
  FaucetHint
} from './components'
import { connectController } from './controller'
import './styles.css'

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

const Wallet = ({
  walletVisible,
  actions,
  web3Modal,
  address,
  localProvider,
  userProvider,
  ensProvider,
  price,
  loadWeb3Modal,
  logoutOfWeb3Modal
}) => {
  /*
  const activateConnectionSearchAnimation = () => {
    // eslint-disable-next-line no-new
    new Typewriter('#wallet .content > .message', {
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
      <WalletView
        address={address}
        provider={userProvider}
        ensProvider={ensProvider}
        price={price}
      />
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

  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  return (
    <div id='wallet'>
      <ReactModal
        className={uniqueWindowId}
        top={160}
        left={430}
        initHeight={500}
        initWidth={290}
        isOpen={walletVisible}
      >
        <div
          className='background-image'
          style={{
            height: '100%',
            overflowY: 'scroll',
            background: 'url(./assets/trimmed/wallet_trimmed.png)',
            backgroundSize: '100% 100%'
          }}
        />
        <div
          className='content'
          style={{
            position: 'absolute',
            top: '13%',
            right: 0,
            height: '86%',
            marginLeft: '9%',
            marginRight: '9%',
            overflow: 'scroll'
          }}
        >
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
              userProvider={userProvider}
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
            <div style={{ position: 'absolute', bottom: 120, marginRight: '29px' }}>
              {faucetHint}
            </div>
          )}

          {faucetAvailable && (
            <div style={{ position: 'absolute', bottom: 0, marginBottom: 29, marginRight: 29 }}>
              <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
            </div>
          )}
        </div>
      </ReactModal>
    </div>
  )
}

export default connectController(Wallet)
