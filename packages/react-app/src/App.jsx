import React, { useCallback, useEffect, useState } from 'react'
// import { useUserProviderAndSigner } from 'eth-hooks'
import { useExchangeEthPrice } from 'eth-hooks/dapps/dex'
import { NETWORKS } from './constants'
import { Layout } from './components'
import { BrowseBadges } from './views'
import MintingPage from './views/MintingPage'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Toast from 'components/Toast'
import { BadgeContext } from 'contexts/BadgeContext'
import { useUserProviderAndSigner } from 'eth-hooks'
import externalContracts from 'contracts/external_contracts'
import { getCurrentChainId } from 'helpers/SwitchToOptimism'
const { ethers } = require('ethers')

// @ts-ignore
function App() {
  // @ts-ignore
  const [localProvider, setLocalProvider] = useState(null)
  const [injectedProvider, setInjectedProvider] = useState(null)
  const [mainnet, setMainnet] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState()
  const [address, setAddress] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [showWrongNetworkToast, setShowWrongNetworkToast] = useState(false)
  const [selectedChainId] = useState(5)
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }

  const targetNetwork = NETWORKS['optimism']
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnet)

  let contractRef
  let providerRef
  if (
    externalContracts[selectedChainId] &&
    externalContracts[selectedChainId].contracts &&
    externalContracts[selectedChainId].contracts.REMIX_REWARD
  ) {
    contractRef = externalContracts[selectedChainId].contracts.REMIX_REWARD
    providerRef = externalContracts[selectedChainId].provider
  } else {
    console.log('kosi externalContract')
  }

  const USE_BURNER_WALLET = false
  /* SETUP METAMASK */
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET)
  const userSigner = userProviderAndSigner.signer
  const closeToast = () => {
    setShowToast(false)
  }

  const displayToast = () => {
    setShowToast(true)
  }

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const holderForConnectedAddress = await userSigner.getAddress()
        // @ts-ignore
        setConnectedAddress(holderForConnectedAddress)
      }
    }
    getAddress()

    return () => {
      getAddress()
    }
  }, [userSigner])

  // useEffect(() => {
  //   (async () => {
  //     const chainInfo = await getCurrentChainId()
  //     if (selectedChainId === chainInfo[0].chainid) return
  //     setSelectedChainId(chainInfo[0].chainid)
  //   })()
  // }, [selectedChainId])

  useEffect(() => {
    const run = async () => {
      const local = new ethers.providers.StaticJsonRpcProvider(providerRef)
      const mainnet = new ethers.providers.StaticJsonRpcProvider(
        'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      )
      await local.ready
      setLocalProvider(local)
      setMainnet(mainnet)
      setLoaded(true)
    }
    run()

    return () => {
      run()
    }
  }, [providerRef])

  const logoutOfWeb3Modal = useCallback(async () => {
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == 'function') {
      await injectedProvider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [injectedProvider])

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
      return
    }
    const provider = window.ethereum
    setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))

    provider.on('chainChanged', chainId => {
      setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    })
    provider.on('accountsChanged', accounts => {
      setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    })
    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutOfWeb3Modal()
    })

    setTabValue(prev => prev)
  }, [logoutOfWeb3Modal])

  const closeWrongNetworkToast = () => {
    setShowWrongNetworkToast(false)
  }

  /* END - SETUP METAMASK */

  const contextPayload = {
    localProvider,
    mainnet,
    selectedChainId,
    address,
    setAddress,
    connectedAddress,
    setConnectedAddress,
    contractConfig,
    externalContracts,
    contractRef,
    price,
    injectedProvider,
    setInjectedProvider,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    setShowToast,
    closeWrongNetworkToast,
    showWrongNetworkToast,
    setShowWrongNetworkToast,
    targetNetwork,
    userSigner,
  }

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
              loadWeb3Modal={loadWeb3Modal}
              connectedAddress={connectedAddress}
              setConnectedAddress={setConnectedAddress}
              injectedProvider={injectedProvider}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          )}
          <Toast
            showToast={showToast}
            closeToast={closeToast}
            snackBarAction={snackBarAction}
            message={'MetaMask is not installed!'}
          />
        </Layout>
      </BadgeContext.Provider>
    </div>
  )
}

export default App
