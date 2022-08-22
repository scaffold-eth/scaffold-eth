import React, { useCallback, useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Address from './Address'
import Box from '@mui/material/Box'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { BadgeContext } from 'contexts/BadgeContext'
import { getCurrentChainId, switchToGoerli, externalParams, switchToOptimism } from 'helpers/SwitchToOptimism'
// @ts-ignore
import { ethers } from 'ethers'
import { deepOrange } from '@mui/material/colors'
import Toast from './Toast'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'

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
  const [chainChanged, setChainChanged] = useState(false)
  const [injectedProvider, setInjectedProvider] = useState(null)
  const [connectedState, setConnectedState] = useState(false)

  const logoutOfWeb3Modal = useCallback(async () => {
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == 'function') {
      await injectedProvider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [injectedProvider])

  const loadWeb3Modal = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
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

    // setTabValue(prev => prev)
  }, [logoutOfWeb3Modal])

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
    setConnectedState(true) // disable the connect button until everything succeeds
    let accounts
    if (window.ethereum === undefined) {
      displayToast()
      setConnectedState(false)
      return
    }
    accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const chainInfo = await getCurrentChainId()
    const { chainId } = chainInfo[0]
    if (chainId !== 10 && chainId !== 5) {
      setShowWrongNetworkToast(true)
      setConnectedState(false)
    }
    if (injectedProvider === null) setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum))
    setConnectedAddress(accounts[0])
    setNetInfo(chainInfo)
  }

  useEffect(() => {
    window.ethereum.on('chainChanged', chainId => {
      console.log({ chainId })
      setChainChanged(true)
    })
  }, [])

  useEffect(() => {
    if (window.ethereum === undefined) {
      displayToast()
      return
    }
    window.ethereum.on('accountsChanged', account => {
      console.log({ account })
      if (account.length === 0) displayToast()
      if (account[0] !== connectedAddress) setConnectedAddress(account[0])
    })
  }, [connectedAddress, displayToast, setConnectedAddress])

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
    const errorMsg = 'Network not supported! Currently supported networks are : Goerli & Optimism'
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
            disabled={connectedState}
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

      {netInfo && netInfo.length > 0 && connectedAddress && connectedAddress.length > 1
        ? netInfo.map(n => (
            <Typography
              key={n.chainId}
              component={'span'}
              variant={'caption'}
              ml={2}
              fontWeight={600}
              color={'#ff0420'}
              alignItems={'center'}
              justifyContent={'center'}
            >{`You are connected to ${n.name}`}</Typography>
          ))
        : null}
      {netInfo && netInfo.length > 0 && connectedAddress && connectedAddress.length > 1 ? (
        <MetaMaskTooltip
          title={`Click here to switch to ${
            netInfo[0].chainId === 5
              ? externalParams[0].chainName
              : netInfo[0].chainId === 10
              ? externalParams[1].chainName
              : 'chains'
          }`}
          placement="bottom"
        >
          <Button
            variant={'contained'}
            sx={{ marginLeft: 3, borderRadius: 3, background: '#81a6f7' }}
            onClick={async () => {
              if (netInfo[0].chainId === 5) {
                await switchToOptimism()
                await logoutOfWeb3Modal()
              }
              if (netInfo[0].chainId === 10) {
                await switchToGoerli()
                await logoutOfWeb3Modal()
              }
            }}
          >
            <AutorenewRoundedIcon />
          </Button>
        </MetaMaskTooltip>
      ) : null}
    </Box>
  )
}
