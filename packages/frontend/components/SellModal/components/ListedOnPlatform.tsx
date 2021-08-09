import { Heading, Stack, Text, Flex, Button, Box, Image } from '@chakra-ui/react'
import { IconPhoto, IconMovie, IconMusic } from '@tabler/icons'
import { useState, useEffect } from 'react'

function ListedOnPlatform(): JSX.Element {

  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    // TODO Fetch listings of all listed items of current wallet owner
  }, [])

    const toggleFilter = (category) => {
        if (activeFilters.includes(category)) {
            const _activeFilters = activeFilters.filter(item => item !== category)
            setActiveFilters(_activeFilters)
        } else {
            const _activeFilters = activeFilters.slice(0)
            _activeFilters.push(category)
            setActiveFilters(_activeFilters)
        }
    }

  return (
    <>
      <Heading as="h1" mb="1.5rem" fontSize="1.5rem">
        Manage your content
      </Heading>

      {/* Filters */}

      <Stack direction="row" mb="2rem">
        <Button 
            size="sm" 
            variant="outline" 
            colorScheme={activeFilters.length === 0 ? 'black' : 'gray'} 
            onClick={() => setActiveFilters([])}
            >
            All
        </Button>
        <Button 
            size="sm"
            variant="outline" 
            colorScheme={(activeFilters.includes('Images') || activeFilters.length === 0) ? 'black' : 'gray'} 
            _hover={{ bg: "var(--chakra-colors-gray-200)" }}
            onClick={() => toggleFilter('Images')}
            >
            <IconPhoto size="1.2rem" />
            <Text pl="1">Images</Text>
        </Button>
        <Button 
            size="sm" 
            variant="outline" 
            colorScheme={(activeFilters.includes('Videos') || activeFilters.length === 0) ? 'black' : 'gray'} 
            _hover={{ bg: "var(--chakra-colors-gray-200)" }}
            onClick={() => toggleFilter('Videos')}
            >
            <IconMovie size="1.2rem" />
            <Text pl="1">Videos</Text>
        </Button>
        <Button 
            size="sm" 
            variant="outline" 
            colorScheme={(activeFilters.includes('Audio') || activeFilters.length === 0) ? 'black' : 'gray'} 
            _hover={{ bg: "var(--chakra-colors-gray-200)" }}
            onClick={() => toggleFilter('Audio')}
            >
            <IconMusic size="1.2rem" />
            <Text pl="1">Audio</Text>
        </Button>
      </Stack>

      {/* Licenses */}

      <Flex wrap="wrap">
        {licenses && licenses.map((item, i) => (
            <LicenseItem 
              item={item} 
              key={i} />
        ))}
      </Flex>


    </>
  )
}

const LicenseItem = ({ item }) => {
  const { name, currency, filePreview, licensees, profit } = item || {}

  return (
      <Box 
          borderRadius="md" 
          overflow="hidden" 
          d="inline-block" 
          cursor="pointer" 
          border="1px solid #000" 
          p=".4rem"
          mr="1rem"
          mb="1rem"
          fontSize="90%"
          _hover={{
              boxShadow: "0 0 0 .35rem rgba(0, 0, 0, 0.08), 0 0 0 .1rem rgba(0, 0, 0, 1)"
          }}
          >
          <Image src={filePreview} alt={name} height="10rem" mb=".3rem" />
          <Text fontWeight="600">{name}</Text>
          <Flex justifyContent="space-between" alignItems="flex-end" fontSize="90%">
              <Box>
                  <Text d="inline-block">{licensees} licensees</Text>
              </Box>
              <Box>
                  <Text d="inline-block" mr="1">Profit</Text>
                  <Text d="inline-block" color="gray.600">{profit} {currency.toUpperCase()}</Text>
              </Box>
          </Flex>
      </Box>

  )
}

const licenses = [
  {
      id: 1,
      name: 'Raccoon Birthday',
      price: 0.15,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 11.jpg',
      licensees: 0,
      profit: 0,
  },
  {
      id: 2,
      name: 'Beach with Pink Sky',
      price: 0.305,
      currency: 'eth',
      fileType: 'Video/MP4',
      filePreview: '/images/gallery/Image 8.jpg',
      licensees: 1,
      profit: 0.305,
  },
  {
      id: 3,
      name: 'Factory in the 1900s',
      price: 0.78,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 1.jpg',
      licensees: 0,
      profit: 0,
  },
  {
      id: 4,
      name: 'Waves',
      price: 0.26,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 3.jpg',
      licensees: 20,
      profit: 5.2,
  },
  {
      id: 5,
      name: 'Pottery Pattern',
      price: 0.242,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 10.jpg',
      licensees: 0,
      profit: 0,
  },
  {
      id: 6,
      name: 'Traced Leaf, Black & White',
      price: 0.10,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 9.jpg',
      licensees: 10,
      profit: 1,
  },
  {
      id: 7,
      name: 'Joker Card',
      price: 0.15,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 13.jpg',
      licensees: 0,
      profit: 4.15,
  },
  {
      id: 8,
      name: 'Extinct Fish Sketch',
      price: 0.90,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 12.jpg',
      licensees: 3,
      profit: 2.7,
  },
  {
      id: 9,
      name: 'Flower Illustration, Watercolour',
      price: 0.18,
      currency: 'eth',
      fileType: 'Image/JPG',
      filePreview: '/images/gallery/Image 7.jpg',
      licensees: 2,
      profit: 0.36,
  },
]

export default ListedOnPlatform
