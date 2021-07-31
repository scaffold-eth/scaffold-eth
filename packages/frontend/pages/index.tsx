import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'

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
        {/* Images */}
        <Box flex="1">
          <div className="image-grid">
            {isFetching
              ? ''
              : images.map((image) => (
                  <GridImage url={image.url} key={image.url} />
                ))}
          </div>
        </Box>

        {/* Sidebar */}
        <Box borderRadius=".6rem" bg="gray.100" p={5} ml="2rem">
            <Text>You simply earn more with Royalty Free NFT</Text>
        </Box>
      </Flex>
    </Layout>
  )
}

const dummyImages = Array.from(Array(13).keys()).map((i) => ({
  url: `/images/gallery/Image ${i + 1}.jpg`,
}))

export default HomeIndex
