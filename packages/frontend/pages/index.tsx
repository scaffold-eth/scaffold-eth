import { Box, Button, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import LandingSidebar from '../components/LandingSidebar'

function HomeIndex(): JSX.Element {
  const images = dummyImages
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsFetching(false))
  })

  const GridImage = ({ url }) => <img className="image-item" src={url} />

  return (
    <Layout>
      <Flex py={[4, null, null, 0]} grow={1}>
        <Box flex="1">
          {/* Category buttons */}
          <Box mb="4">
            <Button variant="black-selected">Images</Button>
            <Button variant="white">Audio</Button>
            <Button variant="white">Video</Button>
          </Box>
          <Box mb="5">
            <Button variant="gray-selected">Curated</Button>
            <Button variant="white">Popular</Button>
            <Button variant="white">New</Button>
          </Box>

          {/* Images */}
          <div className="image-grid">
            {isFetching
              ? ''
              : images.map((image) => (
                  <GridImage url={image.url} key={image.url} />
                ))}
          </div>
        </Box>

        {/* Sidebar */}
        <LandingSidebar />
      </Flex>
    </Layout>
  )
}

const dummyImages = Array.from(Array(13).keys()).map((i) => ({
  url: `/images/gallery/Image ${i + 1}.jpg`,
}))

export default HomeIndex
