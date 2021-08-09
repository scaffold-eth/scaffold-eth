import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Divider,
} from '@chakra-ui/react'
import { IconX, IconArrowsMaximize } from '@tabler/icons'

function BuyNFTModal({
  item,
  brandId,
  brandName,
  isModalOpen,
  setIsModalOpen,
}: {
  item: NFTItemType
  brandId: number
  brandName: string
  isModalOpen: boolean
  setIsModalOpen: any
}): JSX.Element {
  const { id, name, price, currency, filePreview, licensees } =
    item || {}
  const [isLoading, setIsLoading] = useState(false)

  const initializePurchaseTx = () => {
    //TODO Integration with solidity contract call
    setIsLoading(true)
  }

  return (
    <Modal
      size="3xl"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent px="3rem" py="2.5rem" mx=".6rem">
        <Box
          textAlign="right"
          // position="absolute"
          // top="1.5rem"
          // right="1.5rem"
        >
          <Link href={`/buy/nft/${id}`} mr="2">
            <Button
              border=".1rem solid #000"
              variant="outline"
              size="md"
              colorScheme="black"
              px=".5rem"
            >
              <IconArrowsMaximize />
            </Button>
          </Link>

          <Button
            border=".1rem solid #000"
            variant="outline"
            size="md"
            colorScheme="black"
            px=".5rem"
            onClick={() => setIsModalOpen(false)}
          >
            <IconX />
          </Button>
        </Box>
        <ModalBody p="0">
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            <GridItem colSpan={3}>
              <Image src={filePreview} alt={name} m="auto" />
            </GridItem>
            <GridItem colSpan={2}>
              <Text fontSize="2xl" fontWeight="600" mb="1.2rem">
                {name}
              </Text>

              <Box fontSize="90%" mb="1.5rem">
                <Flex mb=".3rem">
                  <Box width="8rem">Licensor</Box>
                  <Box>
                    <Link
                      href={`/buy/licensor/${brandId}`}
                      textDecoration="underline"
                    >
                      {brandName}
                    </Link>
                  </Box>
                </Flex>
                <Flex mb=".3rem">
                  <Box width="8rem">Price</Box>
                  <Box>
                    {price} {currency && currency.toUpperCase()}
                  </Box>
                </Flex>
                {licensees < 10 && (
                  <Flex mb=".3rem">
                    <Box width="8rem">Early Supporter</Box>
                    <Box>
                      <Text
                        fontSize="90%"
                        textColor="var(--colour-highlight)"
                        d="inline-block"
                        mr=".3rem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5.715"
                          height="12.591"
                          viewBox="0 0 5.715 12.591"
                          style={{
                            display: 'inline-block',
                            marginRight: '.3rem',
                          }}
                        >
                          <path
                            id="Path_262"
                            data-name="Path 262"
                            d="M13.477,14,11,18.954h3.715l-2.477,4.954"
                            transform="translate(-10 -12.658)"
                            fill="none"
                            stroke="#19db53"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                        Active
                      </Text>
                      <Text
                        fontSize="90%"
                        textColor="gray.400"
                        d="inline-block"
                      >
                        {10 - licensees} left
                      </Text>
                    </Box>
                  </Flex>
                )}
              </Box>

              <Divider my="6" />

              <Text
                textAlign="right"
                textColor="gray.500"
                fontSize="80%"
                my="2"
              >
                You have 0.03 ETH
              </Text>

              <Button
                onClick={() => initializePurchaseTx()}
                isLoading={isLoading}
                loadingText="Purchasing..."
                variant="press-down"
                mb=".5rem"
                width="100%"
                d="block"
              >
                Purchase with {price} {currency && currency.toUpperCase()}
              </Button>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type NFTItemType = {
  id: number
  name: string
  price: number
  currency: string
  fileType: string
  filePreview: string
  licensees: number
}

export default BuyNFTModal
