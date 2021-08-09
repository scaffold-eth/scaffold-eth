import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Image,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  Tooltip
} from '@chakra-ui/react'
import blockies from 'blockies-ts'
import { IconExternalLink } from '@tabler/icons'
import { truncateAddressString } from '../../utils/truncateAddressString'

function OutboundCosts(): JSX.Element {
  const [data, setData] = useState({})

  useEffect(() => {
    // TODO Fetch outbound costs
    setData(dummyData)
  }, [])

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb="3">
          <Text fontWeight="bold">Upcoming</Text>
          <Link
            href="/dao/proposal"
            fontSize="85%"
            ml="1rem"
            textDecoration="underline"
          >
            New Proposal
          </Link>
        </Flex>
        {data['upcoming'] && data['upcoming'].length > 0 && (
            <Table fontSize="90%">
            <Thead>
                <Tr>
                <Td>DATE</Td>
                <Td>AMOUNT</Td>
                <Td>RECIPIENT</Td>
                <Td>PURPOSE</Td>
                <Td></Td>
                </Tr>
            </Thead>
            <Tbody>
                {data['upcoming'].map((item, i) => (
                    <Tr key={i}>
                        <Td>{item.date}</Td>
                        <Td>{item.amount} <Text fontSize="85%" color="gray.500" d="inline-block">{item.currency}</Text></Td>
                        <Td>
                            <Image 
                                src={blockies.create({ seed: item.recipient }).toDataURL()} 
                                d="inline-block"
                                mr=".3rem"
                                style={{ width: '1.8rem', borderRadius: 'var(--chakra-radii-md)'}}
                                 /> {truncateAddressString(item.recipient)}</Td>
                        <Td>{item.purpose}</Td>
                    </Tr>
                ))}
            </Tbody>
            </Table>
        )}
        {data['past'] && data['past'].length > 0 && data['past'].map( (pastItem, i) => (
            <Box key={`past-item-${i}`} my="10">
                <Text fontWeight="bold" mb="4">{pastItem.date}</Text>
                <Table fontSize="90%">
                    <Thead>
                        <Tr>
                        <Td>DATE</Td>
                        <Td>AMOUNT</Td>
                        <Td>RECIPIENT</Td>
                        <Td>PURPOSE</Td>
                        <Td>TRANSACTION</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {pastItem.transactions && pastItem.transactions.map((item, i) => (
                            <Tr key={i}>
                                <Td>{item.date}</Td>
                                <Td>{item.amount} <Text fontSize="85%" color="gray.500" d="inline-block">{item.currency}</Text></Td>
                                <Td>
                                    <Image 
                                        src={blockies.create({ seed: item.recipient }).toDataURL()} 
                                        d="inline-block"
                                        mr=".3rem"
                                        style={{ width: '1.8rem', borderRadius: 'var(--chakra-radii-md)'}}
                                        /> {truncateAddressString(item.recipient)}</Td>
                                <Td>{item.purpose}</Td>
                                <Td>
                                    <Tooltip label="View transaction">
                                        <Link href={item.transaction} isExternal>
                                            <IconExternalLink stroke={1.5} />
                                        </Link>
                                    </Tooltip>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        ))}
      </Box>
    </>
  )
}

const dummyData = {
  upcoming: [
    {
      date: '30 Aug 2021',
      amount: 12000,
      currency: 'USDC',
      recipient: '0x68a3CE169921304272dA52129203D0337cEF5Be2',
      purpose: 'Solidity Developer',
      transaction: '0xeebc81fc5d6feeb3f3dc572ec093db3eaeddac2d0d4c2740e7a4d1d0a6795e33'
    },
    {
      date: '30 Aug 2021',
      amount: 7800,
      currency: 'USDC',
      recipient: '0xC343d15A8F9595A5245261147d51D005184491db',
      purpose: 'Front-End Developer',
      transaction: '0xeebc81fc5d6feeb3f3dc572ec093db3eaeddac2d0d4c2740e7a4d1d0a6795e33'
    },
  ],
  past: [
    {
      date: 'Jul 2021',
      transactions: [
        {
          date: '31 Jul 2021',
          amount: 12000,
          currency: 'USDC',
          recipient: '0x68a3CE169921304272dA52129203D0337cEF5Be2',
          purpose: 'Solidity Developer',
          transaction: '0xeebc81fc5d6feeb3f3dc572ec093db3eaeddac2d0d4c2740e7a4d1d0a6795e33'
        },
        {
          date: '31 Jul 2021',
          amount: 7800,
          currency: 'USDC',
          recipient: '0xC343d15A8F9595A5245261147d51D005184491db',
          purpose: 'Front-End Developer',
          transaction: '0xeebc81fc5d6feeb3f3dc572ec093db3eaeddac2d0d4c2740e7a4d1d0a6795e33'
        },
      ],
    },
    {
      date: 'Jun 2021',
      transactions: [
        {
          date: '30 Jun 2021',
          amount: 12000,
          currency: 'USDC',
          recipient: '0x68a3CE169921304272dA52129203D0337cEF5Be2',
          purpose: 'Solidity Developer',
          transaction: '0xeebc81fc5d6feeb3f3dc572ec093db3eaeddac2d0d4c2740e7a4d1d0a6795e33'
        },
        {
          date: '30 Jun 2021',
          amount: 7800,
          currency: 'USDC',
          recipient: '0xC343d15A8F9595A5245261147d51D005184491db',
          purpose: 'Front-End Developer',
          transaction: '0xeebc81fc5d6feeb3f3dc572ec093db3eaeddac2d0d4c2740e7a4d1d0a6795e33'
        },
      ],
    },
  ],
}

export default OutboundCosts
