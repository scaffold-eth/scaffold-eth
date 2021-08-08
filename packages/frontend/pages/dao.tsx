import { Box, Heading, Text } from '@chakra-ui/react'
import CurrentBalance from '../components/DAO/CurrentBalance'
import Layout from '../components/layout/Layout'

function DAO(): JSX.Element {
  return (
    <Layout>
      <Heading size="md" mb="12">
        Your Voting Power
      </Heading>
      <Text>Voting power is dependent on rolling monthly sales of content</Text>
      <Box>89 of 600</Box>
      
      <Heading size="md" mb="12">
        DAO Treasury
      </Heading>
      <CurrentBalance />
    </Layout>
  )
}

export default DAO
