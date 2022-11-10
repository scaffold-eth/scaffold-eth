import React, { useCallback, useEffect, useState } from 'react'
// import { useUserProviderAndSigner } from 'eth-hooks'
import { NETWORKS } from './constants'
import { Layout } from './components'
import { BrowseBadges } from './views'
import MintingPage from './views/MintingPage'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Toast from 'components/Toast'
import { BadgeContext } from 'contexts/BadgeContext'
import externalContracts from 'contracts/external_contracts'
const { ethers } = require('ethers')
const temmainnet = new ethers.providers.StaticJsonRpcProvider(
  'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
)
function App() {
  // @ts-ignore
  const [localProvider, setLocalProvider] = useState(null)
  const [mainnet] = useState(temmainnet)
  const [loaded, setLoaded] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState()
  const [injectedProvider, setInjectedProvider] = useState(null)
  const [address, setAddress] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [showWrongNetworkToast, setShowWrongNetworkToast] = useState(false)
  const [selectedChainId, setSelectedChainId] = useState(5)
  const [contract, setContract] = useState(null)
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }

  const targetNetwork = NETWORKS['optimism']

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
  const closeToast = () => {
    setShowToast(false)
  }

  const checkForWeb3Provider = useCallback(() => {
    return window.ethereum === undefined ? 'Not Found' : 'Found'
  }, [])

  const displayToast = useCallback(msg => {
    console.log(msg)
    setShowToast(true)
  }, [])

  useEffect(() => {
    const run = async () => {
      const local = new ethers.providers.StaticJsonRpcProvider(providerRef)
      await local.ready
      setContract(new ethers.Contract(contractRef.address, contractRef.abi, local))
      setLocalProvider(local)
      setLoaded(true)
    }
    run()
  }, [contractRef.abi, contractRef.address, providerRef])

  const snackBarAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={closeToast}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  const closeWrongNetworkToast = () => {
    setShowWrongNetworkToast(false)
  }

  const contextPayload = {
    localProvider,
    mainnet,
    selectedChainId,
    setSelectedChainId,
    address,
    setAddress,
    checkForWeb3Provider,
    connectedAddress,
    setConnectedAddress,
    injectedProvider,
    setInjectedProvider,
    contractConfig,
    displayToast,
    externalContracts,
    contractRef,
    contract,
    setShowToast,
    closeWrongNetworkToast,
    showWrongNetworkToast,
    setShowWrongNetworkToast,
    targetNetwork,
  }

  return (
    <div className="App">
      <BadgeContext.Provider value={contextPayload}>
        <Layout tabValue={tabValue} setTabValue={setTabValue}>
          {loaded && tabValue === 0 && <BrowseBadges />}

          {tabValue === 1 && <MintingPage />}
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
