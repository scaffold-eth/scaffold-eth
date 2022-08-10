import React, { useCallback, useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Address from './Address'
import Box from '@mui/material/Box'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { BadgeContext } from 'contexts/BadgeContext'
import { getCurrentChainId, switchChain, externalParams } from 'helpers/SwitchToOptimism'
import { ethers } from 'ethers'
import { lightGreen } from '@mui/material/colors'
import Toast from './Toast'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

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

const ConnectedButton = ({ handleConnection, connectedAddress, accountButtonConnected, accountButtonInfo }) => {
  const greenConnected = lightGreen['900']
  const hoveredGreen = lightGreen['800']
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
          background: greenConnected,
          ':hover': hoveredGreen,
        }}
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
  )
}

// @ts-ignore
// @ts-ignore
export default function Account({ minimized }) {
  const {
    // @ts-ignore
    injectedProvider,
    // @ts-ignore
    mainnet,
    // @ts-ignore
    loadWeb3Modal,
    // @ts-ignore
    targetNetwork,
    // @ts-ignore
    setShowToast,
    // @ts-ignore
    connectedAddress,
    // @ts-ignore
    setConnectedAddress,
    // @ts-ignore
    selectedChainId,
    // @ts-ignore
    setShowWrongNetworkToast,
    // @ts-ignore
    closeWrongNetworkToast,
    // @ts-ignore
    showWrongNetworkToast,
  } = useContext(BadgeContext)
  let accountButtonInfo
  accountButtonInfo = { name: 'Connect to Mint', action: loadWeb3Modal }
  const accountButtonConnected = 'Connected'
  // eslint-disable-next-line no-unused-vars
  const [_, setNetInfo] = useState([])

  const display = !minimized && (
    <Box>
      {
        connectedAddress && connectedAddress.length > 1 ? (
          <Address
            address={connectedAddress}
            ensProvider={mainnet}
            blockExplorer={targetNetwork.blockExplorer}
            fontSize={16}
          />
        ) : null
        // (
        //   <Typography variant="subtitle1" fontWeight={500} mb={3} sx={{ color: '#333333' }} component={'span'}>
        //     There is no address connected to this wallet! Click the button to connect and view your wallet!
        //   </Typography>
        // )
      }
      {/* <Balance address={connectedAddress} provider={localProvider} price={price} size={20} /> */}
    </Box>
  )

  const handleConnection = useCallback(async () => {
    const chainInfo = await getCurrentChainId()
    let provider
    let accounts
    if (!chainInfo && chainInfo === undefined) {
      setShowToast(true)
      return
    }
    const { chainId, networkId } = chainInfo[0]
    if (chainId !== selectedChainId) {
      setShowWrongNetworkToast(true)
      return
    }
    accountButtonInfo.action()
    if (injectedProvider === undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum)
      accounts = await provider.listAccounts()
      setConnectedAddress(accounts[0])
    } else {
      accounts = await injectedProvider.listAccounts()
      setConnectedAddress(accounts[0])
    }
    // @ts-ignore
    if (chainId === 10 && networkId === 10) {
      await switchChain(externalParams[0])
    }
    if (chainId === 5 && networkId === 5) {
      await switchChain(externalParams[1])
    }
    setNetInfo(chainInfo)
  }, [
    accountButtonInfo,
    injectedProvider,
    selectedChainId,
    setConnectedAddress,
    setShowToast,
    setShowWrongNetworkToast,
  ])

  useEffect(() => {
    if (window.ethereum !== undefined) {
      // @ts-ignore
      // @ts-ignore
      window.ethereum.on('connect', async connectInfo => {
        if (window.ethereum.isConnected()) {
          await handleConnection()
        } else {
          await handleConnection()
        }
      })
    }

    return () => {
      if (window.ethereum !== undefined) {
        // @ts-ignore
        // @ts-ignore
        window.ethereum.removeListener('connect', async connectInfo => {
          if (window.ethereum.isConnected()) {
            await handleConnection()
          } else {
            await handleConnection()
          }
        })
      }
    }
  }, [handleConnection, setShowToast])

  useEffect(() => {
    if (window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', async accounts => {
        if (accounts.length > 0) {
          await handleConnection()
        }
      })
    }

    return () => {
      if (window.ethereum !== undefined) {
        window.ethereum.on('accountsChanged', async accounts => {
          if (accounts.length > 0) {
            await handleConnection()
          }
        })
      }
    }
  }, [handleConnection, setShowToast])

  useEffect(() => {
    if (window.ethereum !== undefined) {
      // @ts-ignore
      // @ts-ignore
      window.ethereum.on('chainChanged', chainid => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum !== undefined) {
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [])

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
  const errorMsg = `Network not supported! Currently supported network: ${
    selectedChainId === 5 ? 'Goerli' : selectedChainId === 10 ? 'Optimism' : ''
  }`
  /* SETUP TOAST FOR WRONG NETWORK */
  const WrongNetworkToast = ({ showWrongNetworkToast, closeWrongNetworkToast, wrongNetworkSnackBar }) => {
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
          accountButtonConnected={accountButtonConnected}
          accountButtonInfo={accountButtonInfo}
          connectedAddress={connectedAddress}
          handleConnection={handleConnection}
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

      {/* {netInfo && netInfo.length > 0 && connectedAddress && connectedAddress.length > 1
        ? netInfo.map(n => (
            <Box
              key={n.chainId}
              component={'span'}
              fontSize={16}
              pt={10}
              ml={5}
              fontWeight={600}
              color={'#ff0420'}
              alignItems={'center'}
              justifyContent={'center'}
            >{`You are currently connected to ${n.name}`}</Box>
          ))
        : null} */}
    </Box>
  )
}
