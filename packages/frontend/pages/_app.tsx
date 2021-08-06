import { ApolloProvider } from '@apollo/client'
import {
  ChainId,
  Config,
  DAppProvider,
  // MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import {
  ChakraProvider,
  extendTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react'
import Sell from '../components/Sell'

import React from 'react'
// import { MulticallContract } from '../artifacts/contracts/contractAddress'
import { useApollo } from '../lib/apolloClient'
import './_app.scss'

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
        _focus: { boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.2)' },
      },
      variants: {
        white: {
          color: '#000',
          background: '#FFF',
          _hover: {
            background: '#f8f8f8',
          },
        },
        'white-selected': {
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
          },
        },
        black: {
          color: '#FFF',
          background: '#000',
        },
        'black-selected': {
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
        'gray-selected': {
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
          },
        },
        'press-down': {
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
          _hover: {
            background: '#f8f8f8',
          },
          _active: {
            top: '3px',
            boxShadow: 'none',
          },
        },
      },
    },
  },
})

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  const router = useRouter()
  const { sell } = router.query

  return (
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />

          <Modal
            size="full"
            isOpen={sell === 'true'}
            onClose={() => router.push(router.route)}
            motionPreset="slideInBottom"
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent px="3rem" py="2.5rem" mx=".6rem">
              {/* <ModalCloseButton /> */}
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => router.push(router.route)}
                  style={{
                    padding: '.5rem',
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                  }}
                >
                  <svg
                    id="Group_38"
                    data-name="Group 38"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 62.962 62.962"
                  >
                    <path
                      id="Path_78"
                      data-name="Path 78"
                      d="M0,0H62.962V62.962H0Z"
                      fill="none"
                    />
                    <rect
                      id="Rectangle_28"
                      data-name="Rectangle 28"
                      width="42.562"
                      height="42.562"
                      rx="2"
                      transform="translate(9.822 9.822)"
                      fill="none"
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                    <path
                      id="Path_79"
                      data-name="Path 79"
                      d="M10,10,20.494,20.494m0-10.494L10,20.494"
                      transform="translate(16.234 16.234)"
                      fill="none"
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                  </svg>
                </button>
              </div>
              <ModalBody>
                <Sell />
              </ModalBody>
            </ModalContent>
          </Modal>
        </ChakraProvider>
      </DAppProvider>
    </ApolloProvider>
  )
}

export default MyApp
