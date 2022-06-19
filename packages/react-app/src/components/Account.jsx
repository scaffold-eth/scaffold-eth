// @ts-nocheck
import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd'
import Typography from '@mui/material/Typography'
import Address from './Address'
import Balance from './Balance'
import Box from '@mui/material/Box'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { BadgeContext } from 'contexts/BadgeContext'

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

// @ts-ignore
export default function Account({ minimized }) {
  const { localProvider, mainnet, loadWeb3Modal, price, targetNetwork, connectedAddress, switchToOptimism } =
    useContext(BadgeContext)
  let accountButtonInfo
  accountButtonInfo = { name: 'Connect to Mint', action: loadWeb3Modal }
  const accountButtonConnected = 'Connected'
  const [disableOptimismButton, flipDisableOptimismButton] = useState(false)
  const [showOptimismButton, setShowOptimismButton] = useState(false)

  async function doOptimismSwitch() {
    try {
      flipDisableOptimismButton(true)
      console.log('hit doOptimismSwitch')
      await switchToOptimism()
      flipDisableOptimismButton(false)
    } catch (error) {
      console.log({ error })
    }
  }

  const display = !minimized && (
    <Box>
      {connectedAddress && connectedAddress.length > 1 ? (
        <Address
          address={connectedAddress}
          ensProvider={mainnet}
          blockExplorer={targetNetwork.blockExplorer}
          fontSize={20}
        />
      ) : (
        <Typography variant="subtitle1" fontWeight={500} mb={3} sx={{ color: '#333333' }} component={'span'}>
          There is no address connected to this wallet! Click the button to connect and view your wallet!
        </Typography>
      )}
      <Balance
        address={
          // @ts-ignore
          connectedAddress
        }
        provider={localProvider}
        price={price}
        size={20}
      />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }} alignItems={'center'} justifyContent={'center'} pb={5}>
      {display}
      {
        <MetaMaskTooltip title="Please note that this REQUIRES MetaMask." placement="bottom">
          <Button
            variant={'contained'}
            sx={{ borderRadius: 3, marginTop: 5, padding: 1.8, marginLeft: 3, background: '#81a6f7' }}
            onClick={() => {
              accountButtonInfo.action()
              setShowOptimismButton(true)
            }}
            size={'large'}
          >
            <Typography variant={'button'} fontWeight={'bolder'}>
              {
                // @ts-ignore
                connectedAddress && connectedAddress.length > 1 ? accountButtonConnected : accountButtonInfo.name
              }
            </Typography>
          </Button>
        </MetaMaskTooltip>
      }
      {showOptimismButton ? (
        <MetaMaskTooltip title="Click to switch to Optimism." placement="bottom">
          <IconButton
            sx={{ borderRadius: 3, marginTop: 5, padding: 1.8, marginLeft: 3 }}
            onClick={doOptimismSwitch}
            disabled={disableOptimismButton}
            size={'large'}
          >
            <SwitchAccessShortcutAddIcon fontSize={'large'} htmlColor={'#81a6f7'} />
            {/* <Typography variant={'button'} fontWeight={'bolder'}>
          Switch to Optimism
        </Typography> */}
          </IconButton>
        </MetaMaskTooltip>
      ) : null}
    </Box>
  )
}
