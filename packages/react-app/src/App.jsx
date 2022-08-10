import React, { useEffect, useState } from 'react'
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
const { ethers } = require('ethers')

// @ts-ignore
function App() {
  // @ts-ignore
  const [localProvider, setLocalProvider] = useState(null)
  const [injectedProvider, setInjectedProvider] = useState()
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
        setConnectedAddress(holderForConnectedAddress[0])
      }
    }
    getAddress()

    return () => {
      getAddress()
    }
  }, [userSigner])

  useEffect(() => {
    const run = async () => {
      const local = new ethers.providers.StaticJsonRpcProvider(providerRef)
      const mainnet = new ethers.providers.StaticJsonRpcProvider(
        'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      )
      await local.ready
      // @ts-ignore
      setLocalProvider(local)
      setMainnet(mainnet)
      setLoaded(true)
    }
    run()

    return () => {
      run()
    }
  }, [providerRef])

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

  const loadWeb3Modal = async () => {
    if (typeof window.ethereum === 'undefined') {
      // console.log('MetaMask is not installed!')
      displayToast()
      // metamask not installed
      return
    }
    const provider = window.ethereum
    await provider.request({ method: 'eth_requestAccounts' })

    /**
     * @param accountPayload string[]
     */
    provider.on('accountsChanged', async accountPayload => {
      // accountPayload Array<string>
      console.log(`account changed!`)
      if (accountPayload.length === 0) {
        console.log('Metamask requires login or no accounts added')
        // show toast if need be
      } else if (accountPayload[0] !== connectedAddress) {
        setConnectedAddress(accountPayload[0])
      }
    })

    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      // @ts-ignore
      setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    })

    provider.on('accountsChanged', () => {
      console.log(`account changed!`)
      // @ts-ignore
      setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutOfWeb3Modal()
    })

    setTabValue(prev => prev)
  }

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
