import React, { useEffect } from 'react'
import { Box, Flex, Link, Text } from '@chakra-ui/react'
import styled from 'styled-components'

function ProfitDistributionModel(): JSX.Element {
  // const [data, setData] = useState({})

  useEffect(() => {
    // TODO Fetch current distribution model
    // setData(dummyData)
  }, [])

  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      border="1px solid var(--chakra-colors-gray-200)"
      borderRadius="lg"
      p="1.5rem"
    >
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb="3">
          <Text>Profit Distribution Model</Text>
          <Link href="/dao/proposal" fontSize="85%" ml="1rem" textDecoration="underline">New Proposal</Link>
        </Flex>
        <Progress>
          <ProgressBar
            role="progressbar"
            style={{ width: "93%" }}
            aria-valuenow="95"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            95%
          </ProgressBar>
          <ProgressBar
            role="progressbar"
            style={{ width: "7%", background: 'var(--colour-highlight)' }}
            aria-valuenow="5"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            5%
          </ProgressBar>
        </Progress>
        <Box mt=".6rem">
            <Box d="inline-block" mr="1rem">
                <LegendColour style={{ background: '#000' }}></LegendColour>
                <Text d="inline-block" fontSize="85%">Licensor&apos;s % Profit Per Sale</Text>
            </Box>
            <Box d="inline-block">
                <LegendColour style={{ background: 'var(--colour-highlight)' }}></LegendColour>
                <Text d="inline-block" fontSize="85%">To Treasury</Text>
            </Box>
        </Box>
      </Box>
    </Flex>
  )
}

const Progress = styled.div`
  display: flex;
  height: 1rem;
  overflow: hidden;
  font-size: 0.75rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
  border: 1px solid #000;
`
const ProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  text-align: center;
  background-color: #000;
  transition: width 0.6s ease;
`
const LegendColour = styled.div`
display: inline-block;
    width: .7rem;
    height: .7rem;
    background: #000;
    border-radius: var(--chakra-radii-sm);
    margin-right: .3rem;
`

// const dummyData = {
//   licensorPercentage: 0.95,
// }

export default ProfitDistributionModel
