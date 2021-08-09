import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
  } from 'recharts'
  import moment from 'moment'
  import React, { useState, useEffect } from 'react'
  import { Box, Text } from '@chakra-ui/react'
  import { numberWithCommas } from '../../utils/numberWithCommas'
  
  function PastMonthRevenue(): JSX.Element {
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
          width={300} 
          height={200}
          >
          <Box position="absolute" top="1.5rem" left="1.5rem" zIndex="1">
              <Text>Past Month Revenue</Text>
              <Box>
                  <Text d="inline-block" mr=".3rem">$</Text>
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
  
  // Generate dummy data
  const dummyData = [], N = 30
  let currBalance = 0
  for (let i=N; i>=0; i--) {
      const toAdd = Math.random() * (5000 - 0) + 0;
      let result = moment()
      result = result.subtract(i, "days")
      dummyData.push({
          date: result.format('DD MMM YY'),
          balance: parseFloat((currBalance + toAdd).toFixed(2))
      })
      currBalance += toAdd
  }
  
  export default PastMonthRevenue
  