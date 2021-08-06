import { useRouter } from 'next/router'
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react'
import Sell from './Sell'
import ModalCloseButton from '../ModalCloseButton'

function SellModal(): JSX.Element {

    const router = useRouter()
  const { sell } = router.query

    return (
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
                <ModalCloseButton />
              </div>
              <ModalBody>
                <Sell />
              </ModalBody>
            </ModalContent>
          </Modal>
    )
}

export default SellModal