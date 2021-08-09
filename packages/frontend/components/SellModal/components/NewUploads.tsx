import {
  Box,
  Grid,
  GridItem,
  Heading,
  ListItem,
  UnorderedList,
  Stack,
  Text,
} from '@chakra-ui/react'
import styled from 'styled-components'
import MusicVideoAudioSVG from './MusicVideoAudioSVG'

function NewUploads(): JSX.Element {
  return (
    <>
      <Grid mt="2rem" fontSize="sm" templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem colSpan={1} mr="2rem" position="sticky" top="0" alignSelf="flex-start">
          <Heading as="h1" mb="1.5rem" fontSize="1.5rem">
            Upload your content to start selling
          </Heading>
          <Text mb="1.5rem">Make sure that your media files are</Text>

          <UnorderedList>
            <ListItem>Owned by you</ListItem>
            <ListItem>High quality and clear</ListItem>
            <ListItem>Original and not over edited</ListItem>
          </UnorderedList>
        </GridItem>
        <GridItem colSpan={2}>
          <UploadBox style={{ cursor: 'pointer' }}>
            <Stack direction="column" mx="auto" my="8vh">
              <MusicVideoAudioSVG />
            <Box height="2rem"></Box>
              <Text fontSize="xl" color="#fff" textAlign="center" marginTop="2rem">
                Drag and drop up to 10 files
                <br />
                or{' '}
                <Text color="var(--colour-highlight)" d="inline-block">
                  Browse
                </Text>{' '}
                to choose your files
              </Text>
            </Stack>
          </UploadBox>
        </GridItem>
      </Grid>
    </>
  )
}

const UploadBox = styled.div`
  border: 1rem solid var(--chakra-colors-gray-100);
  background: #000;
  border-radius: var(--chakra-radii-md);
`

export default NewUploads
