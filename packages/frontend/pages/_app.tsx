import { ApolloProvider } from '@apollo/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  // MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
// import { MulticallContract } from '../artifacts/contracts/contractAddress'
import { useApollo } from '../lib/apolloClient'
import "./_app.scss"

// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Goerli,
    ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    ChainId.xDai,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
  // multicallAddresses: {
  //   ...MULTICALL_ADDRESSES,
  //   [ChainId.Hardhat]: MulticallContract,
  //   [ChainId.Localhost]: MulticallContract,
  // },
}

const theme = extendTheme({
  // colors: {
  //   brand: {
  //     100: "#f7fafc",
  //     900: "#1a202c",
  //   },
  // },
  components: { 
    Button: { 
      baseStyle: { 
        position: 'relative',
        _focus: { boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.2)' }
      },
      variants: {
        "white": {
          color: '#000',
          background: '#FFF',
        },
        "white-selected": {
          color: '#000',
          background: '#FFF',
          _after: {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: '#000',
          }
        },
        "black": {
          color: '#FFF',
          background: '#000',
        },
        "black-selected": {
          color: '#FFF',
          background: '#000',
          _after: {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: '#FFF',
          },
        },
        "gray-selected": {
          color: '#000',
          background: 'var(--chakra-colors-gray-100)',
          _after: {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: '#000',
          }
        },
        "press-down": {
          color: '#000',
          border: '0.15rem solid #000',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 3px 0 0 #000',
          transition: 'unset',
          _after: {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%', 
            top: '0',
            left: '0',
            transform: 'scale(0)',
            transition: 'transform 0.3s ease-in',
          },
          _active: {
            top: '3px',
            boxShadow: 'none'
          }
        }
      },
    }
  }
})

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </DAppProvider>
    </ApolloProvider>
  )
}

export default MyApp
