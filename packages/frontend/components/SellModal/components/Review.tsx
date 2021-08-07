import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  Link,
  Checkbox,
  Image,
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react'
import { truncateAddressString } from '../../../utils/truncateAddressString'

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
          {reviewItems && reviewItems.map((item, i) => (
            <ReviewItem item={item} key={i} />
          ))}
        </GridItem>
      </Grid>
    </>
  )
}

type ReviewItemType = {
  fileType: string, 
  filePreview: string, 
  fileUrl: string, 
  name: string, 
  tags: string[], 
  category: string
}

function ReviewItem({ item } : { item: ReviewItemType}) : JSX.Element {
  return (
    <Checkbox colorScheme="black">
      <Flex>
        <Image src={item.filePreview} alt={item.name} />
        <Box>
          <Table>
            <Tbody>
              <Tr>
                <Td fontWeight="bold">File Type</Td>
                <Td>{item.fileType}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Name</Td>
                <Td>{item.name}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Tags</Td>
                <Td>{item.tags && item.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Category</Td>
                <Td>{item.category}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">URL</Td>
                <Td>{item.fileUrl} {copyIcon}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Checkbox>
  )
}

const reviewItems = [
  {
    fileType: 'Image/PNG',
    filePreview: '/images/gallery/Image 11.jpg',
    fileUrl: 'https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqV',
    name: 'Raccoon Birthday',
    tags: ['raccoon', 'birthday', 'illustration', 'fun', 'orange', 'party'],
    category: "Animals",
  },
  {
    fileType: 'Video/MP4',
    filePreview: '/images/gallery/Image 8.jpg',
    fileUrl: 'https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqV',
    name: 'Beach with Pink Sky',
    tags: ['beach', 'pink', 'illustration', 'japanese', 'nudity', 'minimalist', 'simple', 'sea', 'ocean', 'sand'],
    category: "Lifestyles",
  }
]

const copyIcon = <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" viewBox="0 0 17.5 17.5">
<path id="Path_268" data-name="Path 268" d="M39,29.25H37.75V28A2.752,2.752,0,0,0,35,25.25H27A2.752,2.752,0,0,0,24.25,28v8A2.752,2.752,0,0,0,27,38.75h1.25V40A2.752,2.752,0,0,0,31,42.75h8A2.752,2.752,0,0,0,41.75,40V32A2.752,2.752,0,0,0,39,29.25Zm-12,8A1.252,1.252,0,0,1,25.75,36V28A1.252,1.252,0,0,1,27,26.75h8A1.252,1.252,0,0,1,36.25,28v1.25H31A2.752,2.752,0,0,0,28.25,32v5.25ZM40.25,40A1.252,1.252,0,0,1,39,41.25H31A1.252,1.252,0,0,1,29.75,40V32A1.252,1.252,0,0,1,31,30.75h8A1.252,1.252,0,0,1,40.25,32Z" transform="translate(-24.25 -25.25)"/>
</svg>


export default Review
