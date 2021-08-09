import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { IconSearch } from '@tabler/icons'
import { useEthers, useNotifications } from '@usedapp/core'
import blockies from 'blockies-ts'
import NextLink from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
// import Balance from '../Balance'
import NavLink from '../NavLink'
import ConnectWallet from '../ConnectWallet'
import Head, { MetaProps } from './Head'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: 'Local Transaction Started',
  transactionSucceed: 'Local Transaction Completed',
}

// Takes a long hash string and truncates it.
function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

/**
 * Component
 */
const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {

  const { account, deactivate } = useEthers()
  const { notifications } = useNotifications()
  const router = useRouter()

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <div>
      <Head customMeta={customMeta} />
      <header>
        <Container maxWidth="container.xl">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            pt="5"
            pb="12"
          >
            <Flex py={[4, null, null, 0]} grow={1} alignItems="center">
              <Link href="/">
                <Image
                  height="35px"
                  src="/images/logo-with-wordmark.svg"
                  alt="Royalty Free NFT"
                  mr={7}
                />
              </Link>

              <Box padding=".15rem" border="1px solid #000" borderRadius=".4rem" mr="1.5rem">
                <NavLink to="/buy" style={{ padding: '.3rem var(--chakra-space-4)'}}>Buy</NavLink>
                <NavLink to={`${router.route}?sell=true`} style={{ padding: '.3rem var(--chakra-space-4)'}}>Sell</NavLink>
                <NavLink to="/dao" style={{ padding: '.3rem var(--chakra-space-4)'}}>DAO</NavLink>
              </Box>

              <InputGroup width="21rem">
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em">
                  <IconSearch />
                </InputLeftElement>
                <Input placeholder="Search by licensors or content name" borderColor="gray.400" />
              </InputGroup>


            </Flex>

            <Flex
              order={[-1, null, null, 2]}
              alignItems={'center'}
              justifyContent={['flex-start', null, null, 'flex-end']}
            >
              {account ? (
                <Menu placement="bottom-end">
                  <MenuButton as={Button} pl="1">
                    <Flex alignItems="center">
                      <Image
                        style={{ display: 'inline-block' }}
                        mr="2"
                        src={blockieImageSrc}
                        alt="blockie"
                        borderRadius={6}
                      />
                      <span style={{ display: 'inline-block' }}>
                        {truncateHash(account)}
                    </span>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        deactivate()
                      }}
                    >
                      Disconnect
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <ConnectWallet />
              )}
            </Flex>
          </Flex>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">
          {children}
          {notifications.map((notification) => {
            if (notification.type === 'walletConnected') {
              return null
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                position="fixed"
                bottom="8"
                right="8"
                width="400px"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {TRANSACTION_TITLES[notification.type]}
                  </AlertTitle>
                  <AlertDescription overflow="hidden">
                    Transaction Hash:{' '}
                    {truncateHash(notification.transaction.hash, 61)}
                  </AlertDescription>
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <footer
        style={{ 
          background: 'var(--chakra-colors-gray-100)', 
          fontSize: '90%',
          color: 'var(--chakra-colors-gray-500)'
        }}>
        <Container  
          py="3" 
          maxWidth="container.xl" 
          >
          <SimpleGrid
            columns={[1, 1, 2, 2, 2]}
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex py={[1, 1, 1, 1]} grow={1}>
              <Text>
                &copy; {new Date().getFullYear()} 
              </Text>
              <Image
                  maxHeight="22px"
                  src="/images/logo-with-wordmark-gray.svg"
                  alt="Royalty Free NFT"
                  pl={2}
                />
            </Flex>
            <Flex py={[-1, null, null, 0]} justifyContent={['flex-start', null, null, 'flex-end']}>
              <NextLink href="/buy" passHref>
                <Link px="4" py="1">
                  Buy
                </Link>
              </NextLink>
              <NextLink href="/sell" passHref>
                <Link px="4" py="1">
                  Sell
                </Link>
              </NextLink>
            </Flex>
          </SimpleGrid>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
