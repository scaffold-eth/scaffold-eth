import 'antd/dist/antd.css'
import React, { useEffect, useState, useCallback } from 'react'
import { useUserProviderAndSigner } from 'eth-hooks'
import { useExchangeEthPrice } from 'eth-hooks/dapps/dex'
import { NETWORKS } from './constants'
import { Layout } from './components'
import { BrowseBadges } from './views'
import { Account } from './components'
import MintingPage from './views/MintingPage'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Toast from 'components/Toast'
import { BadgeContext } from 'contexts/BadgeContext'
import externalContracts from 'contracts/external_contracts'
const { ethers } = require('ethers')

function App(props) {
  const [loaded, setLoaded] = useState(false)
  const [localProvider, setLocalProvider] = useState(null)
  const [connectedAddress, setConnectedAddress] = useState()
  const [injectedProvider, setInjectedProvider] = useState()
  const [mainnet, setMainnet] = useState(null)
  const [address, setAddress] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [selectedChainId] = useState(10)
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }

  const targetNetwork = NETWORKS['optimism']
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnet)

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
  let contractRef
  if (
    externalContracts[selectedChainId] &&
    externalContracts[selectedChainId].contracts &&
    externalContracts[selectedChainId].contracts.REMIX_REWARD
  ) {
    contractRef = externalContracts[selectedChainId].contracts.REMIX_REWARD
  }

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress()
        // @ts-ignore
        setConnectedAddress(newAddress)
        console.log(newAddress)
      }
    }
    getAddress()
  }, [userSigner])

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
    window.ethereum.request({ method: 'eth_requestAccounts' })

    // @ts-ignore
    setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))

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
    // eslint-disable-next-line
  }, [setInjectedProvider])

  /* END - SETUP METAMASK */

  /* SETUP MAINNET & OPTIMISM provider */

  useEffect(() => {
    const run = async () => {
      const localProvider = new ethers.providers.StaticJsonRpcProvider('https://mainnet.optimism.io')

      await localProvider.ready

      const mainnet = new ethers.providers.StaticJsonRpcProvider(
        'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      )

      setLocalProvider(localProvider)
      setMainnet(mainnet)
      setLoaded(true)
    }
    run()
  }, [])

  /* END - SETUP MAINNET & OPTIMISM provider */

  return (
    <div className="App">
      <BadgeContext.Provider
        value={{
          localProvider,
          mainnet,
          injectedProvider,
          selectedChainId,
          address,
          setAddress,
          connectedAddress,
          contractConfig,
          externalContracts,
          contractRef,
        }}
      >
        <Layout tabValue={tabValue} setTabValue={setTabValue}>
          {loaded && tabValue === 0 && (
            <BrowseBadges
              address={address}
              connectedAddress={connectedAddress}
              injectedProvider={injectedProvider}
              setAddress={setAddress}
              localProvider={localProvider}
              mainnet={mainnet}
              selectedChainId={10}
              {...props}
            />
          )}

          {tabValue === 1 && (
            <MintingPage
              // @ts-ignore
              tabValue={tabValue}
              setTabValue={setTabValue}
              wallet={
                <Account
                  // @ts-ignore
                  useBurner={USE_BURNER_WALLET}
                  address={connectedAddress}
                  localProvider={localProvider}
                  userSigner={userSigner}
                  mainnetProvider={mainnet}
                  price={price}
                  loadWeb3Modal={loadWeb3Modal}
                  logoutOfWeb3Modal={logoutOfWeb3Modal}
                  blockExplorer={targetNetwork.blockExplorer}
                />
              }
            />
          )}
          <Toast showToast={showToast} closeToast={closeToast} snackBarAction={snackBarAction} />
        </Layout>
      </BadgeContext.Provider>
    </div>
  )
}

export default App
