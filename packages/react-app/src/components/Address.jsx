import React from 'react'
import Blockies from 'react-blockies'
import { useLookupAddress } from 'eth-hooks/dapps/ens'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

/** 
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
**/

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || 'https://etherscan.io/'}address/${address}`

export default function Address(props) {
  const currentTheme = 'light'
  const address = props.value || props.address
  const ens = useLookupAddress(props.ensProvider, address)
  const ensSplit = ens && ens.split('.')
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === 'eth'
  const etherscanLink = blockExplorerLink(address, props.blockExplorer)
  let displayAddress = address?.substr(0, 5) + '...' + address?.substr(-4)

  if (validEnsCheck) {
    displayAddress = ens
  } else if (props.size === 'short') {
    displayAddress += '...' + address.substr(-4)
  } else if (props.size === 'long') {
    displayAddress = address
  }

  // if (!address) {
  //   return (
  //     <span>
  //       {/* <Skeleton avatar paragraph={{ rows: 1 }} /> */}
  //     </span>
  //   )
  // }

  if (props.minimized) {
    return (
      <Box style={{ verticalAlign: 'middle' }}>
        <a
          style={{ color: currentTheme === 'light' ? '#222222' : '#ddd' }}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          <Blockies seed={address.toLowerCase()} size={8} scale={2} />
        </a>
      </Box>
    )
  }

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Blockies seed={address.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
      {props.onChange ? (
        // <Text editable={{ onChange: props.onChange }} copyable={{ text: address }} style={{ marginLeft: 3 }}>
        //   <Button
        //     variant={'text'}
        //     size={'large'}
        //     sx={{ fontSize: 24 }}
        //     target="_blank"
        //     href={etherscanLink}
        //     rel="noopener noreferrer"
        //   >
        //     {displayAddress}
        //   </Button>
        // </Text>
        <Button target="_blank" href={etherscanLink} rel="noopener noreferrer" variant={'text'} size={'large'}>
          <Typography variant={'h5'}>{displayAddress}</Typography>
        </Button>
      ) : (
        <a
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
          style={{
            color: 'rgb(108, 108, 108)',
            textDecoration: 'none',
          }}
        >
          <Typography variant={'body1'} fontWeight={700}>{displayAddress}</Typography>
        </a>
      )}
    </Box>
  )
}
