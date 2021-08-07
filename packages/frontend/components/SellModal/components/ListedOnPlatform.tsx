import {
  Button,
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

function ListedOnPlatform(): JSX.Element {
  return (
    <>
      <Grid mt="2rem" fontSize="sm" templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem colSpan="1" mr="2rem">
          <Heading as="h1" mb="1.5rem" fontSize="1.5rem">
            Manage your content
          </Heading>
          <Text mb="1.5rem">Make sure that your media files are</Text>

          <UnorderedList>
            <ListItem>Owned by you</ListItem>
            <ListItem>High quality and clear</ListItem>
            <ListItem>Original and not over edited</ListItem>
          </UnorderedList>
        </GridItem>
        <GridItem colSpan="2">
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

export default ListedOnPlatform
