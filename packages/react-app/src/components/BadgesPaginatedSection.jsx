import Grid from '@mui/material/Grid'
import NftCard from './NftCard'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { BadgeContext } from 'contexts/BadgeContext'
import Fab from '@mui/material/Fab'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useCallback } from 'react'
import AddressedCard from './AddressedCard'

export default function BadgesPaginatedSection({
  badges,
  checkeventBagesAndBadges,
  checkForWeb3Provider,
  etherscanRef,
  eventBadges,
  setBadges,
}) {
  const pageSize = 10
  // @ts-ignore
  const { contractRef, localProvider, mainnet } = useContext(BadgeContext)
  const contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
  const [pageNumber, setPageNumber] = useState(1)
  const [pagedBadges, setPagedBadges] = useState([])
  const mobileResponsiveMatch = useMediaQuery('(min-width:600px)')
  const getPaginationData = useCallback(
    (pgSize, pgNumber) => {
      const startIndex = pgNumber * pgSize - pgSize
      const endIndex = startIndex + pgSize
      const result = eventBadges.slice(startIndex, endIndex)
      return result
    },
    [eventBadges],
  )

  const loadMore = async () => {
    setPageNumber(prev => prev + 1)
    setPagedBadges(prevArray => {
      const result = [...new Set([...prevArray, ...eventBadges])]
      return result
    })
  }

  useEffect(() => {
    if (pagedBadges.length === 0) {
      setPagedBadges([...new Set(getPaginationData(pageSize, pageNumber))])
    }
  }, [pagedBadges.length, getPaginationData, pageNumber, pageSize])

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
        }}
        mt={15}
        // mb={10}
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
            <AddressedCard badges={badges} />
          ) : pagedBadges && pagedBadges.length > 0 ? (
            pagedBadges.map(event => {
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
                    checkForWeb3Provider={checkForWeb3Provider}
                  />
                </Grid>
              )
            })
          ) : null}
          <Fab
            variant={'extended'}
            size="large"
            sx={{
              position: 'fixed',
              bottom: mobileResponsiveMatch ? 590 : 400,
              top: mobileResponsiveMatch ? 690 : 400,
              right: 36,
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
      </Box>
    </>
  )
}
