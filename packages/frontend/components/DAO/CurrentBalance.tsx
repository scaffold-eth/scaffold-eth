import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import React, { useState, useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { numberWithCommas } from '../../utils/numberWithCommas'

function CurrentBalance(): JSX.Element {
  const [data, setData] = useState([])

  useEffect(() => {
    // TODO Fetch current balance
    setData(dummyData)
  }, [])

  return (
    <Box 
        position="relative"
        border="1px solid var(--chakra-colors-gray-200)" 
        borderRadius="lg" 
        width={500} 
        height={300}
        >
        <Box position="absolute" top="1.5rem" left="1.5rem">
            <Text>Current Balance</Text>
            <Box>
                $
                <Text 
                    fontSize="200%" 
                    fontWeight="bold"
                    d="inline-block"
                    >
                    {data && data.length > 0 && numberWithCommas(data[data.length-1]['balance'])}
                </Text>
            </Box>
        </Box>
        <ResponsiveContainer>
      <AreaChart width={500} height={300} data={data}>
        <XAxis dataKey="date" hide={true} />
        <YAxis domain={['dataMin', 'dataMax']} hide={true} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#19DB53"
          fill="#CDFFDC"
        />
      </AreaChart>
      </ResponsiveContainer>
    </Box>
  )
}

const dummyData = [
  {
    date: '01 Aug 2021',
    balance: 298778,
  },
  {
    date: '02 Aug 2021',
    balance: 299252,
  },
  {
    date: '03 Aug 2021',
    balance: 299500,
  },
  {
    date: '04 Aug 2021',
    balance: 299811,
  },
  {
    date: '05 Aug 2021',
    balance: 304029,
  },
  {
    date: '06 Aug 2021',
    balance: 310092,
  },
  {
    date: '07 Aug 2021',
    balance: 312065,
  },
  {
    date: '08 Aug 2021',
    balance: 315920,
  },
]

export default CurrentBalance
