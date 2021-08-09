import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import CurrentBalance from '../components/DAO/CurrentBalance'
import PastMonthRevenue from '../components/DAO/PastMonthRevenue'
import ProfitDistributionModel from '../components/DAO/ProfitDistributionModel'
import OutboundCosts from '../components/DAO/OutboundCosts'
import Layout from '../components/layout/Layout'

function DAO(): JSX.Element {
  return (
    <Layout>
      <Heading size="md" mb="8">
        DAO Treasury
      </Heading>
      <Flex>
        <Box marginRight="4"><CurrentBalance /></Box>
        <Box marginRight="4"><PastMonthRevenue /></Box>
        <Box><ProfitDistributionModel /></Box>
      </Flex>

        <Divider mb="9" mt="9" />

      <Heading size="md" mb="8" >
        Outbound Costs
      </Heading>
      <OutboundCosts />
    </Layout>
  )
}



export default DAO
