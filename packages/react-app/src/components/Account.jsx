import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Address from './Address'
import Balance from './Balance'
import Box from '@mui/material/Box'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { BadgeContext } from 'contexts/BadgeContext'
import { getCurrentChainId, switchToGoerli } from 'helpers/SwitchToOptimism'

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
// @ts-ignore
export default function Account({ minimized, doOptimismSwitch }) {
  const {
    // @ts-ignore
    targetProvider,
    // @ts-ignore
    localProvider,
    // @ts-ignore
    mainnet,
    // @ts-ignore
    loadWeb3Modal,
    // @ts-ignore
    loadWeb3ModalGoerli,
    // @ts-ignore
    price,
    // @ts-ignore
    targetNetwork,
    // @ts-ignore
    connectedAddress,
    // @ts-ignore
    setConnectedAddress,
  } = useContext(BadgeContext)
  let accountButtonInfo
  accountButtonInfo = { name: 'Connect to Mint', action: loadWeb3Modal, goreliAction: loadWeb3ModalGoerli }
  const accountButtonConnected = 'Connected'
  const [netInfo, setNetInfo] = useState([])

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
        <MetaMaskTooltip
          title="This connection requires MetaMask. By clicking here, you accept a connection to Metamask"
          placement="bottom"
        >
          <Button
            variant={'contained'}
            sx={{ borderRadius: 3, marginTop: 5, padding: 1.8, marginLeft: 3, background: '#81a6f7' }}
            onClick={async () => {
              const chainInfo = await getCurrentChainId()
              const { chainId, networkId, name } = chainInfo
              console.log({ chainInfo })
              accountButtonInfo.action()
              const accounts = await targetProvider.listAccounts()
              console.log({ accounts })
              // @ts-ignore
              setConnectedAddress(accounts[0])
              if (chainId === 10 && networkId === 10) {
                console.log(`connected to ${name}`)
                await doOptimismSwitch()
              }
              if (chainId === 5 && networkId === 5) {
                console.log(`connected to ${name}`)
                await switchToGoerli()
              }
              setNetInfo(chainInfo)
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

      {netInfo && netInfo.length > 0 && connectedAddress && connectedAddress.length > 1
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
        : null}
    </Box>
  )
}
