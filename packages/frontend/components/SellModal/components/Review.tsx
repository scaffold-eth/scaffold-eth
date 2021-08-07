import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  Link,
} from '@chakra-ui/react'
import styled from 'styled-components'
import { truncateAddressString } from '../../../utils/truncateAddressString'
import MusicVideoAudioSVG from './MusicVideoAudioSVG'

function Review(): JSX.Element {
  return (
    <>
      <Grid mt="2rem" fontSize="sm" templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem colSpan="1" mr="2rem" pr="1rem" borderRight="1px solid var(--chakra-colors-gray-200)">
          <Heading as="h1" mb="1.5rem" fontSize="1.5rem">
            Review your files
          </Heading>
          <Text mb="1.5rem">The selected media files will be listed under the OpenLaw license signed by you in this transaction:</Text>

          <Stack direction="row" alignItems="center">
            <Text mr=".8rem">Agreement Tx</Text>
            <Link href="https://etherscan.io/tx/0x298beaa0e556cdc4563d572f86aa005b08e770148b1ef9df028594f10391eb68" isExternal>
              <Button colorScheme="gray">
                {truncateAddressString('0x298beaa0e556cdc4563d572f86aa005b08e770148b1ef9df028594f10391eb68')}
              </Button>
            </Link>
          </Stack>
        </GridItem>
        <GridItem colSpan="2">
          
        </GridItem>
      </Grid>
    </>
  )
}

export default Review
