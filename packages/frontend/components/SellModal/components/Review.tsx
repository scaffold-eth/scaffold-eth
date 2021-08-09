import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  Link,
  Image,
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { IconX } from '@tabler/icons'
import { truncateAddressString } from '../../../utils/truncateAddressString'
import styled from 'styled-components'

function Review(): JSX.Element {

  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    // TODO Get files which are hosted on IPFS, but not yet listed
  }, [])



  const handleChange = (e) => {
    const target = e.target
    const checked = target.checked
    const itemId = target.id
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      const _selectedItems = selectedItems.filter(item => item !== itemId)
      setSelectedItems(_selectedItems)
    }
  }

  const listOnPlatform = () => {
    // TODO Use selectedItems to create NFTs using smart contract
    // console.log(selectedItems)
  }

  return (
    <>
      <Grid mt="2rem" mb="2rem" fontSize="sm" templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem colSpan={1} mr="2rem" pr="1rem" borderRight="1px solid var(--chakra-colors-gray-200)" position="sticky" top="0" alignSelf="flex-start">
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
        <GridItem colSpan={2}>
          {reviewItems && reviewItems.map((item, i) => (
            <ReviewItem item={item} key={i} checked={selectedItems.includes(item.id)} handleChange={handleChange} />
          ))}
        </GridItem>
      </Grid>
      <StickyFooter>
          <Button variant="press-down" onClick={() => listOnPlatform()}>
            List <Numbering>{selectedItems.length}</Numbering> items
          </Button>
      </StickyFooter>
    </>
  )
}

type ReviewItemType = {
  id: string,
  fileType: string, 
  filePreview: string, 
  fileUrl: string, 
  name: string, 
  tags: string[], 
  category: string
}

function ReviewItem(
  { item, handleChange, checked } : { item: ReviewItemType, handleChange: any, checked: boolean}
) : JSX.Element {

  return (
    <FormCheck>
      <FormCheckInput type="checkbox" checked={checked} id={item.id} onChange={handleChange} />
      <FormCheckLabel for={item.id}>
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={2} textAlign="center">
            <Image src={item.filePreview} alt={item.name} maxHeight="13rem" />
          </GridItem>
          <GridItem colSpan={3}>
            <Table size="sm">
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
                  <Td>
                    {item.tags && item.tags.map(tag => 
                      <Badge key={tag} mr="1" mb="1">{tag}</Badge>)
                    }
                  </Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">Category</Td>
                  <Td>{item.category}</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">URL</Td>
                  <Td>{item.fileUrl} <Box d="inline-block" ml="1" verticalAlign="middle">{copyIcon}</Box></Td>
                </Tr>
              </Tbody>
            </Table>
          </GridItem>
        </Grid>
      </FormCheckLabel>
      <DeleteButton>
        <IconX style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }} />
      </DeleteButton>
    </FormCheck>
  )
}

const reviewItems = [
  {
    id: 'Qme7ss3ARVgxv6rXqV',
    fileType: 'Image/PNG',
    filePreview: '/images/gallery/Image 11.jpg',
    fileUrl: 'https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqV',
    name: 'Raccoon Birthday',
    tags: ['raccoon', 'birthday', 'illustration', 'fun', 'orange', 'party'],
    category: "Animals",
  },
  {
    id: 'Xve7ss3ARVgxv6rXqV',
    fileType: 'Video/MP4',
    filePreview: '/images/gallery/Image 8.jpg',
    fileUrl: 'https://ipfs.io/ipfs/Xve7ss3ARVgxv6rXqV',
    name: 'Beach with Pink Sky',
    tags: ['beach', 'pink', 'illustration', 'japanese', 'nudity', 'minimalist', 'simple', 'sea', 'ocean', 'sand'],
    category: "Lifestyles",
  }
]

const FormCheck = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 1.5rem;
  margin-bottom: 0.8rem;
  cursor: pointer;
`
const FormCheckInput = styled.input`
  width: 1.5rem;
  height: 1.5rem;
  flex: 0 0 1.5rem;
  border-radius: .25em;
  padding: 0;
  margin-right: .5rem;
  vertical-align: top;
  background-color: #fff;
  background-repeat: no-repeat;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0,0,0,.25);
  appearance: none;
  cursor: pointer;

  &:focus {
    box-shadow: 0 0 0 0.25rem rgb(0 0 0 / 15%);
  }

  &:checked {
    background-color: #000;
    border-color: var(--chakra-colors-gray-700);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
  }
`
const FormCheckLabel = styled.label`
  div:hover > & {
    background: var(--chakra-colors-gray-100);
  }
  width: 100%;
  padding: 1rem;
  border-radius: var(--chakra-radii-lg);
  cursor: pointer;
  border: 1px solid var(--chakra-colors-gray-100);

  input:checked + & {
    border-color: #000;
  }
` 
const DeleteButton = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #000;
  color: #fff;
  transform: translate(0, -50%);
  transition: transform .2s ease-in-out, opacity .2s ease-in-out, background .2s linear;
  opacity: 0;

  div:hover > & {
    transform: translate(1.5rem, -50%);
    opacity: 1;
  }
  &:hover {
    background: var(--chakra-colors-gray-500);
  }
`
const StickyFooter = styled.div`
  position: sticky;
  bottom: 1.5rem;
  border-radius: var(--chakra-radii-lg);
  background: #000;
  padding: .5rem;
  text-align: right;
`
const Numbering = styled.div`
    display: inline-block;
    border-radius: 50%;
    min-width: 1.2rem;
    min-height: 1.2rem;
    padding: .15rem;
    margin-left: .3rem;
    margin-right: .3rem;
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

const copyIcon = <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" viewBox="0 0 17.5 17.5">
<path id="Path_268" data-name="Path 268" d="M39,29.25H37.75V28A2.752,2.752,0,0,0,35,25.25H27A2.752,2.752,0,0,0,24.25,28v8A2.752,2.752,0,0,0,27,38.75h1.25V40A2.752,2.752,0,0,0,31,42.75h8A2.752,2.752,0,0,0,41.75,40V32A2.752,2.752,0,0,0,39,29.25Zm-12,8A1.252,1.252,0,0,1,25.75,36V28A1.252,1.252,0,0,1,27,26.75h8A1.252,1.252,0,0,1,36.25,28v1.25H31A2.752,2.752,0,0,0,28.25,32v5.25ZM40.25,40A1.252,1.252,0,0,1,39,41.25H31A1.252,1.252,0,0,1,29.75,40V32A1.252,1.252,0,0,1,31,30.75h8A1.252,1.252,0,0,1,40.25,32Z" transform="translate(-24.25 -25.25)"/>
</svg>


export default Review
