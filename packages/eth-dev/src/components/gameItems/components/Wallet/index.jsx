/* eslint-disable import/no-cycle */
import React from 'react'

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { WindowModal } from '..'
import { INFURA_ID, getNetworkByChainId, NETWORKS } from '../../../../constants'
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
import NetworkSelectDropdown from '../NetworkSelectDropdown'
import {
  Wallet as WalletView,
  Account,
  Faucet,
  GasGauge,
  Address,
  Balance,
  FaucetHint
} from './components'

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
  isOpen,
  web3Modal,
  address,
  localProvider,
  userProvider,
  ensProvider,
  price,
  loadWeb3Modal,
  logoutOfWeb3Modal
}) => {
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

  // const yourMainnetBalance = useBalance(mainnetProvider, address)

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer

  /*
  // if you don't have any money, scan the other networks for money
  usePoller(() => {
    if (!cachedNetwork) {
      if (balance === 0) {
        checkBalancesAndSwitchNetwork(address)
      }
    }
  }, 7777)
  */
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
    <div id='wallet'>
      <WindowModal
        initTop={160}
        initLeft={430}
        initHeight={585}
        initWidth={340}
        backgroundPath='./assets/items/wallet.png'
        dragAreaHeightPercent={10}
        isOpen={isOpen}
        contentContainerStyle={{
          padding: '4% 8% 9%'
        }}
      >
        <div
          className='content'
          style={{
            width: '100%'
          }}
        >
          {/*
          <div className='message' style={{ ...styles.message }}>
            <Typist cursor={{ show: false }} avgTypingDelay={50} loop />
          </div>
          */}

          {walletDisplay}

          {address && <Balance value={yourLocalBalance} fontSize={20} price={price} />}

          {/*
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
          */}

          <div style={{ float: 'right', width: '100%' }}>
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

          <div style={{ position: 'absolute', bottom: 0, marginBottom: '10%', padding: 10 }}>
            <div style={{ marginBottom: 10 }}>Network:</div>
            <NetworkSelectDropdown networkOptions={NETWORKS} targetNetwork={targetNetwork} />
            <span style={{ marginLeft: 12 }}>
              <GasGauge gasPrice={gasPrice} />
            </span>
          </div>

          {faucetHint && (
            <div style={{ position: 'absolute', bottom: 120, marginRight: 29 }}>{faucetHint}</div>
          )}

          {faucetAvailable && (
            <div style={{ position: 'absolute', bottom: 0, marginBottom: 29, marginRight: 29 }}>
              <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
            </div>
          )}
        </div>
      </WindowModal>
    </div>
  )
}

export default Wallet
