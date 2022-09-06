import React, { useCallback, useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Address from './Address'
import Box from '@mui/material/Box'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { BadgeContext } from 'contexts/BadgeContext'
import { getCurrentChainId, switchNetworkChain } from 'helpers/SwitchToOptimism'
// @ts-ignore
import { ethers } from 'ethers'
import { deepOrange } from '@mui/material/colors'
import Toast from './Toast'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { NetInfo } from './NetInfo'

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

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
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
**/

const MetaMaskTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      // backgroundColor: '#f5f5f9',
      color: 'rgba(255,165,0)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 'bolder',
      border: '1px solid #dadde9',
    },
  }),
)

const ConnectedButton = ({ handleConnection, connectedAddress, accountButtonInfo }) => {
  const hoveredGreen = deepOrange['800']
  return (
    <MetaMaskTooltip
      title="This connection requires MetaMask. By clicking here, you accept a connection to Metamask"
      placement="bottom"
    >
      <Button
        variant={'contained'}
        sx={{
          borderRadius: 3,
          padding: 1.2,
          marginLeft: 3,
          background: 'rgb(255,165,0)',
          ':hover': {
            background: hoveredGreen,
          },
        }}
        onClick={handleConnection}
        size={'small'}
      >
        <Typography variant={'button'} fontWeight={'bolder'}>
          {
            // @ts-ignore
            connectedAddress && connectedAddress.length > 1 && 'Disconnect'
          }
        </Typography>
      </Button>
    </MetaMaskTooltip>
  )
}

export default function Account({ minimized }) {
  const {
    // @ts-ignore
    mainnet,
    // @ts-ignore
    targetNetwork,
    // @ts-ignore
    displayToast,
    // @ts-ignore
    connectedAddress,
    // @ts-ignore
    setConnectedAddress,
    // @ts-ignore
    selectedChainId,
    // @ts-ignore
    injectedProvider,
    // @ts-ignore
    setInjectedProvider,
    // @ts-ignore
    setShowWrongNetworkToast,
    // @ts-ignore
    closeWrongNetworkToast,
    // @ts-ignore
    showWrongNetworkToast,
  } = useContext(BadgeContext)
  let accountButtonInfo
  const accountButtonConnected = 'Connected'
  // eslint-disable-next-line no-unused-vars
  const [netInfo, setNetInfo] = useState([])

  const checkForWeb3Provider = useCallback(() => {
    return window.ethereum === undefined ? 'Not Found' : 'Found'
  }, [])

  const logoutOfWeb3Modal = useCallback(async () => {
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == 'function') {
      await injectedProvider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [injectedProvider])

  const loadWeb3Modal = useCallback(async () => {
    if (checkForWeb3Provider() === 'Not Found') {
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
    })

    // setTabValue(prev => prev)
  }, [checkForWeb3Provider, displayToast, setInjectedProvider])

  accountButtonInfo = { name: 'Connect to Mint', action: loadWeb3Modal }
  const display = !minimized && (
    <Box>
      {connectedAddress && connectedAddress.length > 1 ? (
        <Address
          address={connectedAddress}
          ensProvider={mainnet}
          blockExplorer={targetNetwork.blockExplorer}
          fontSize={16}
        />
      ) : null}
    </Box>
  )

  const handleConnection = async () => {
    let accounts
    await loadWeb3Modal()
    if (checkForWeb3Provider() === 'Not Found') return
    const chainInfo = await getCurrentChainId()
    const { chainId } = chainInfo[0]
    console.log({ chainId })
    if (chainId !== selectedChainId) {
      setShowWrongNetworkToast(true)
      await switchNetworkChain(selectedChainId)
      accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setConnectedAddress(accounts[0])
      setNetInfo(chainInfo)
      return
    }
    if (chainId === selectedChainId) {
      accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setConnectedAddress(accounts[0])
      setNetInfo(chainInfo)
      return
    }
  }

  useEffect(() => {
    if (checkForWeb3Provider() === 'Not Found') {
      displayToast()
      return
    }
    window.ethereum.on('chainChanged', async chainId => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (!netInfo && netInfo.length) setNetInfo(await getCurrentChainId())
      if (accounts && accounts.length) {
        setConnectedAddress(accounts[0])
      }
    })
    return () => {
      checkForWeb3Provider() === 'Found'
        ? window.ethereum.removeListener('chainChanged', () => console.log('removed'))
        : console.log('Metamask is not installed')
    }
  }, [checkForWeb3Provider, displayToast, netInfo, setConnectedAddress])

  useEffect(() => {
    if (checkForWeb3Provider() === 'Not Found') {
      displayToast()
      return
    }
    window.ethereum.on('accountsChanged', account => {
      if (account.length === 0) displayToast()
      if (account[0] !== connectedAddress) setConnectedAddress(account[0])
    })

    return () => {
      window.ethereum.removeListener('accountsChanged', () => console.log('accountsChanged removed!'))
    }
  }, [checkForWeb3Provider, connectedAddress, displayToast, setConnectedAddress])

  const wrongNetworkSnackBar = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          setShowWrongNetworkToast(!showWrongNetworkToast)
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )
  /* SETUP TOAST FOR WRONG NETWORK */
  const WrongNetworkToast = ({ showWrongNetworkToast, closeWrongNetworkToast, wrongNetworkSnackBar }) => {
    const errorMsg = 'Network not supported!'
    return (
      <Toast
        showToast={showWrongNetworkToast}
        closeToast={closeWrongNetworkToast}
        snackBarAction={wrongNetworkSnackBar}
        message={errorMsg}
      />
    )
  }
  return (
    <Box sx={{ display: 'flex' }} alignItems={'center'} justifyContent={'center'} pb={1}>
      {display}
      {window.ethereum && window.ethereum.isConnected() && connectedAddress && connectedAddress.length ? (
        <ConnectedButton
          accountButtonInfo={accountButtonInfo}
          connectedAddress={connectedAddress}
          handleConnection={logoutOfWeb3Modal}
        />
      ) : (
        <MetaMaskTooltip
          title="This connection requires MetaMask. By clicking here, you accept a connection to Metamask"
          placement="bottom"
        >
          <Button
            variant={'contained'}
            sx={{ borderRadius: 3, padding: 1.2, marginLeft: 3, background: '#81a6f7' }}
            onClick={handleConnection}
            size={'small'}
          >
            <Typography variant={'button'} fontWeight={'bolder'}>
              {
                // @ts-ignore
                connectedAddress && connectedAddress.length > 1 ? accountButtonConnected : accountButtonInfo.name
              }
            </Typography>
          </Button>
        </MetaMaskTooltip>
      )}
      <WrongNetworkToast
        showWrongNetworkToast={showWrongNetworkToast}
        closeWrongNetworkToast={closeWrongNetworkToast}
        // @ts-ignore
        wrongNetworkSnackBar={wrongNetworkSnackBar}
      />

      <NetInfo
        netInfo={netInfo}
        connectedAddress={connectedAddress}
        checkForWeb3Provider={checkForWeb3Provider}
        setNetInfo={setNetInfo}
        displayToast={displayToast}
      />
    </Box>
  )
}
