import Grid from '@mui/material/Grid'
import NftCard from './NftCard'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { BadgeContext } from 'contexts/BadgeContext'
import Fab from '@mui/material/Fab'
import { useCallback } from 'react'
import AddressedCard from './AddressedCard'

export default function BadgesPaginatedSection({
  appState,
  badges,
  checkeventBagesAndBadges,
  etherscanRef,
  eventBadges,
  setBadges,
}) {
  // @ts-ignore
  const { contractRef, localProvider, mainnet } = useContext(BadgeContext)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [pagedBadges, setPagedBadges] = useState([])
  const getPaginationData = useCallback(
    (pgSize, pgNumber) => {
      const startIndex = pgNumber * pgSize - pgSize
      const endIndex = startIndex + pgSize
      const result = eventBadges.slice(startIndex, endIndex)
      return result
    },
    [eventBadges],
  )

  const returnPaginatedData = (pgSize, pgNumber) => {
    const startIndex = pgNumber * pgSize - pgSize
    const endIndex = startIndex + pgSize
    const result = eventBadges.slice(startIndex, endIndex)
    return result
  }

  useEffect(() => {
    if (pagedBadges.length === 0) {
      setPagedBadges(getPaginationData(pageSize, pageNumber))
    }
    return () => {
      if (pagedBadges.length === 0) {
        setPagedBadges(getPaginationData(pageSize, pageNumber))
      }
    }
  }, [pagedBadges.length, getPaginationData, pageNumber, pageSize])

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
          height: '100vh',
        }}
        mt={15}
      >
        <Grid
          container
          spacing={1}
          ml={'auto'}
          mr={'auto'}
          mt={15}
          paddingRight={3}
          paddingLeft={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 1.3, md: 2 }}
          sx={{
            background:
              'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
          }}
        >
          {checkeventBagesAndBadges(badges) ? (
            <Grid item md={'auto'} lg={'auto'} mt={-12} ml={'auto'} mr={'auto'}>
              <AddressedCard badges={badges} />
            </Grid>
          ) : pagedBadges && pagedBadges.length > 0 ? (
            [...new Set(pagedBadges)].map(event => {
              let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
              return (
                <Grid
                  item
                  mt={-12}
                  mb={15}
                  ml={'auto'}
                  mr={'auto'}
                  key={`${event.to}-${event.id}`}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <NftCard
                    etherscan={etherscanRef}
                    to={event.to}
                    id={event.id}
                    transactionHash={event.transactionHash}
                    contract={contract}
                    mainnet={mainnet}
                  />
                </Grid>
              )
            })
          ) : eventBadges && eventBadges.length > 0 ? (
            eventBadges.map(event => {
              let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
              return (
                <Grid
                  item
                  mt={-12}
                  mb={15}
                  ml={'auto'}
                  mr={'auto'}
                  key={`${event.to}-${event.id}`}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <NftCard
                    etherscan={etherscanRef}
                    to={event.to}
                    id={event.id}
                    transactionHash={event.transactionHash}
                    contract={contract}
                    mainnet={mainnet}
                  />
                </Grid>
              )
            })
          ) : null}
          <Grid item justifySelf={'flex-end'}>
            <Fab
              variant={'extended'}
              size="large"
              sx={{
                color: 'whitesmoke',
                ':hover': {
                  backgroundColor: '#1565c0',
                },
                padding: 3,
                backgroundColor: '#81a6f7',
              }}
              disabled={!eventBadges.length}
              onClick={() => {
                setPageNumber(prev => prev + 1)
                setPagedBadges(prevArray => {
                  const newFetch = returnPaginatedData(pageSize, pageNumber)
                  const result = [...prevArray, ...newFetch]
                  return result
                })
              }}
            >
              <DownloadingRoundedIcon sx={{ marginRight: 2, fontSize: 48 }} />
              <Typography variant="button" fontWeight={'700'}>
                Load More
              </Typography>
            </Fab>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
