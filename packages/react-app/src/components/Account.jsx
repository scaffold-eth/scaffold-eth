import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Address from './Address'
import Balance from './Balance'
import Box from '@mui/material/Box'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

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

export default function Account({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
}) {
  let accountButtonInfo
  accountButtonInfo = { name: 'Connect to Mint', action: loadWeb3Modal }
  const accountButtonConnected = 'Connected'

  const display = !minimized && (
    <Box>
      {address && address.length > 1 ? (
        <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={20} />
      ) : (
        <Typography variant="subtitle1" fontWeight={500} mb={3} sx={{ color: '#333333' }} component={'span'}>
          There is no address connected to this wallet! Click the button to connect and view your wallet!
        </Typography>
      )}
      <Balance address={address} provider={localProvider} price={price} size={20} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }} alignItems={'center'} justifyContent={'center'} pb={5}>
      {display}
      {
        <MetaMaskTooltip title="Please note that this REQUIRES MetaMask." placement="right">
          <Button
            variant={'contained'}
            sx={{ borderRadius: 5, marginTop: 5, padding: 1.8, marginLeft: 3, background: '#81a6f7' }}
            onClick={accountButtonInfo.action}
            size={'large'}
          >
            <Typography variant={'button'} fontWeight={'bolder'}>
              {address && address.length > 1 ? accountButtonConnected : accountButtonInfo.name}
            </Typography>
          </Button>
        </MetaMaskTooltip>
      }
    </Box>
  )
}
