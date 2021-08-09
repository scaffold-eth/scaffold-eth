import { useRouter } from 'next/router'
import { Button, Box, Flex, Modal, ModalOverlay, ModalContent, ModalBody, Stack, ModalHeader } from '@chakra-ui/react'
import styled from 'styled-components'

import InitializeAccount from "./components/InitializeAccount"
import Review from "./components/Review"
import ListedOnPlatform from "./components/ListedOnPlatform"
import NewUploads from "./components/NewUploads"
import { IconX } from '@tabler/icons'
import NavLink from '../NavLink'


function SellModal(): JSX.Element {

  // TODO Check on blockchain whether this wallet has initialized his wallet
  // If not, help user create Seller account
  const initialized = true 
  const router = useRouter()
  const { sell } = router.query

  return (
    <Modal
      size="full"
      isOpen={!!sell}
      onClose={() => router.push(router.route)}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent px="3rem" py="2.5rem" mx=".6rem">
        <ModalHeader>
        {initialized && (
            <Flex justifyContent="space-between">
              <Stack direction="row">
                {/* <Button variant="black-selected">New uploads</Button>
                <Button variant="white">Review <Numbering>2</Numbering></Button>
                <Button variant="white">Listed on Platform <Numbering>7</Numbering></Button> */}
                <NavLink to={`${router.route}?sell=true`}>New uploads</NavLink>
                <NavLink to={`${router.route}?sell=review`}>Review <Numbering>2</Numbering></NavLink>
                <NavLink to={`${router.route}?sell=listed`}>Listed on Platform <Numbering>7</Numbering></NavLink>
              </Stack>
              <Box>
                <NavLink to={`/buy/licensor/xx`}>View my seller page</NavLink>
                <Button
                  border=".1rem solid #000"
                  variant="outline"
                  size="md"
                  colorScheme="black"
                  px=".5rem"
                  ml="1rem"
                  onClick={() => router.push(router.route)}
                >
                  <IconX />
                </Button>
              </Box>
            </Flex>
          )}
          {!initialized && (
            <Box textAlign="right">
              <Button
                border=".1rem solid #000"
                variant="outline"
                size="md"
                colorScheme="black"
                px=".5rem"
                onClick={() => router.push(router.route)}
              >
                <IconX />
              </Button>
            </Box>
          )}
        </ModalHeader>

        <ModalBody>
          {!initialized && <InitializeAccount />}
          {initialized && sell === "true" && <NewUploads />}
          {initialized && sell === "review" && <Review />}
          {initialized && sell === "listed" && <ListedOnPlatform />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}


const Numbering = styled.div`
    display: inline-block;
    border-radius: 50%;
    min-width: 1.2rem;
    min-height: 1.2rem;
    padding: .15rem;
    margin-left: .3rem;
    text-align: center;
    border: 1px solid var(--chakra-colors-gray-500);
    font-size: 90%;
    line-height: 1;
    box-sizing: content-box;
    white-space: nowrap;
    
    &:before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        padding-top: 100%;
        height: 0;
    }
    span {
        display: inline-block;
        vertical-align: middle;
    }
`

export default SellModal