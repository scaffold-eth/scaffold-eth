import React, { useEffect, useState, useCallback, useReducer } from 'react'
import { useUserProviderAndSigner } from 'eth-hooks'
import { useExchangeEthPrice } from 'eth-hooks/dapps/dex'
import { NETWORKS } from './constants'
import { Layout } from './components'
import { BrowseBadges } from './views'
import MintingPage from './views/MintingPage'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Toast from 'components/Toast'
import { BadgeContext } from 'contexts/BadgeContext'
import externalContracts from 'contracts/external_contracts'
import { switchToOptimism } from 'helpers/SwitchToOptimism'
const { ethers } = require('ethers')

const APPSTATEACTION = {
  GOERLICHAINID: '5',
  OPTIMISMCHAINID: '10',
}

const defaultState = {
  provider: new ethers.providers.Web3Provider(window.ethereum),
  chainId: '10',
  contractRef: externalContracts['10'].contracts.REMIX_REWARD,
}

function appStateReducer(state, actionType) {
  if (actionType.GOERLICHAINID) {
    const newState = {
      provider: new ethers.providers.Web3Provider(window.ethereum),
      chainid: '5',
      contractRef: externalContracts['5'].contracts.REMIX_REWARD,
    }
    return newState
  }

  return state
}

function App({ mainnet, localProvider, appChainId }) {
  const [appState, appDispatch] = useReducer(appStateReducer, defaultState)
  const [loaded, setLoaded] = useState(false)
  // const [localProvider, setLocalProvider] = useState(null)
  const [connectedAddress, setConnectedAddress] = useState()
  const [injectedProvider, setInjectedProvider] = useState()
  // const [mainnet, setMainnet] = useState(null)
  const [address, setAddress] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [showToast, setShowToast] = useState(false)
  // const [selectedChainId, setSelectedChainId] = useState(appChainId)
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }

  const targetNetwork = NETWORKS['optimism']
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnet)

  const USE_BURNER_WALLET = false

  /* SETUP METAMASK */

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(appState.provider, localProvider, USE_BURNER_WALLET)
  const userSigner = userProviderAndSigner.signer

  const closeToast = () => {
    setShowToast(false)
  }

  const displayToast = () => {
    setShowToast(true)
  }
  console.log({ appState })
  let contractRef
  const chainId = appState.chainId
  if (
    externalContracts[chainId] &&
    externalContracts[chainId].contracts &&
    externalContracts[chainId].contracts.REMIX_REWARD
  ) {
    contractRef = externalContracts[chainId].contracts.REMIX_REWARD
  } else {
    console.log('kosi externalContract')
  }

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress()
        // @ts-ignore
        setConnectedAddress(newAddress)
        console.log({ newAddress, userSigner })
      }
    }
    getAddress()
  }, [userSigner])

  // useEffect(() => {
  //   appState.provider.on('chainChanged', chainId => {
  //     // @ts-ignore
  //     appDispatch({ actionType: APPSTATEACTION.GOERLICHAINID })
  //   })
  // }, [appState.provider, appState])

  const logoutOfWeb3Modal = async () => {
    // @ts-ignore
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == 'function') {
      // @ts-ignore
      await injectedProvider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const snackBarAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={closeToast}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  const loadWeb3Modal = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      // console.log('MetaMask is not installed!')
      displayToast()
      // metamask not installed
      return
    }
    const provider = window.ethereum
    // @ts-ignore
    // setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    appDispatch({ actionType: APPSTATEACTION.OPTIMISMCHAINID })

    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      // @ts-ignore
      // setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
      appDispatch({ actionType: APPSTATEACTION.OPTIMISMCHAINID })
    })

    provider.on('accountsChanged', () => {
      console.log(`account changed!`)
      // @ts-ignore
      // setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
      appDispatch({ actionType: APPSTATEACTION.OPTIMISMCHAINID })
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutOfWeb3Modal()
    })

    console.log({ injectedProvider })
    setTabValue(prev => prev)
    // eslint-disable-next-line
  }, [appDispatch])

  const loadWeb3ModalGoerli = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      // console.log('MetaMask is not installed!')
      displayToast()
      // metamask not installed
      return
    }
    const provider = window.ethereum
    // @ts-ignore
    // setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    appDispatch({ actionType: APPSTATEACTION.GOERLICHAINID })

    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      // @ts-ignore
      appDispatch({ actionType: APPSTATEACTION.GOERLICHAINID })
    })

    provider.on('accountsChanged', () => {
      console.log(`account changed!`)
      // @ts-ignore
      appDispatch({ actionType: APPSTATEACTION.GOERLICHAINID })
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutOfWeb3Modal()
    })

    console.log({ injectedProvider })
    setTabValue(prev => prev)
    // eslint-disable-next-line
  }, [appDispatch])

  /* END - SETUP METAMASK */

  /* SETUP MAINNET & OPTIMISM provider */

  useEffect(() => {
    const run = async () => {
      await localProvider.ready

      // const mainnet = new ethers.providers.StaticJsonRpcProvider(
      //   'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      // )

      // setLocalProvider(localProvider)
      // setMainnet(mainnet)
      setLoaded(true)
    }
    run()
  }, [localProvider.ready])
  const targetProvider = appState.provider
  const selectedChainId = appState.chainId
  /* END - SETUP MAINNET & OPTIMISM provider */
  const contextPayload = {
    localProvider,
    mainnet,
    targetProvider,
    selectedChainId,
    address,
    setAddress,
    connectedAddress,
    contractConfig,
    externalContracts,
    contractRef,
    switchToOptimism,
    price,
    targetNetwork,
    loadWeb3Modal,
    loadWeb3ModalGoerli,
    logoutOfWeb3Modal,
    userSigner,
  }

  console.log({ injectedProvider, contractRef, connectedAddress, userSigner })
  return (
    <div className="App">
      <BadgeContext.Provider value={contextPayload}>
        <Layout tabValue={tabValue} setTabValue={setTabValue}>
          {loaded && tabValue === 0 && <BrowseBadges />}

          {tabValue === 1 && (
            <MintingPage
              // @ts-ignore
              tabValue={tabValue}
              setTabValue={setTabValue}
              injectedProvider={injectedProvider}
            />
          )}
          <Toast showToast={showToast} closeToast={closeToast} snackBarAction={snackBarAction} />
        </Layout>
      </BadgeContext.Provider>
    </div>
  )
}

export default App
