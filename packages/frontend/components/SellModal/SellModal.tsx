import { useRouter } from 'next/router'
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, Stack } from '@chakra-ui/react'
import styled from 'styled-components'

import InitializeAccount from "./components/InitializeAccount"
import Review from "./components/Review"
import ListedOnPlatform from "./components/ListedOnPlatform"
import NewUploads from "./components/NewUploads"
import ModalCloseButton from '../ModalCloseButton'
import NavLink from '../NavLink'


function SellModal({ initialized = true }): JSX.Element {

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
        {/* <ModalCloseButton /> */}
        <div style={{ textAlign: 'right' }}>
          <ModalCloseButton onClick={() => router.push(router.route)}/>
        </div>
        <ModalBody>
          {!initialized && <InitializeAccount />}
          {initialized && (
            <Stack direction="row">
              {/* <Button variant="black-selected">New uploads</Button>
              <Button variant="white">Review <Numbering>2</Numbering></Button>
              <Button variant="white">Listed on Platform <Numbering>7</Numbering></Button> */}
              <NavLink to={`${router.route}?sell=true`}>New uploads</NavLink>
              <NavLink to={`${router.route}?sell=review`}>Review <Numbering>2</Numbering></NavLink>
              <NavLink to={`${router.route}?sell=listed`}>Listed on Platform <Numbering>7</Numbering></NavLink>
            </Stack>
          )}
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