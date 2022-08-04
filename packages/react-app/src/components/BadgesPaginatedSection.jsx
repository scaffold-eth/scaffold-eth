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

export default function BadgesPaginatedSection({ eventBadges, etherscanRef, appState }) {
  // @ts-ignore
  const { contractRef, localProvider, mainnet } = useContext(BadgeContext)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [viewAllBadges, flipViewAllBadges] = useState(false)
  const [badges, setBadges] = useState([])

  const getPaginationData = useCallback(
    (pgSize, pgNumber) => {
      const startIndex = pgNumber * pgSize - pgSize
      const endIndex = startIndex + pgSize
      const result = eventBadges.slice(startIndex, endIndex)
      return result
    },
    [eventBadges],
  )

  useEffect(() => {
    if (badges.length === 0) {
      setBadges(getPaginationData(pageSize, pageNumber))
    }
  }, [badges.length, getPaginationData, pageNumber, pageSize])

  return (
    <>
      {/* <Box
        mb={15}
        mt={10}
        p={1}
        display={'flex'}
        justifyContent={'space-between'}
        borderRadius={3}
        border={'1px solid #ccc'}
      >
        <Button
          size="large"
          variant={'contained'}
          disabled={pageNumber === 1}
          onClick={goToPreviousPage}
          sx={{
            borderRadius: 3,
            backgroundColor: '#81a6f7',
            ':disabled': { backgroundColor: '#81a6f7', color: 'whitesmoke' },
          }}
        >
          <ArrowBackIosNewRoundedIcon />
          <Typography variant={'button'}>Previous</Typography>
        </Button>
        <FormControlLabel
          // @ts-ignore
          control={<Switch checked={viewAllBadges} onChange={handleCheck} size="large" />}
          label="View all Badges"
          labelPlacement="start"
        />
        <Button
          size="large"
          variant={'contained'}
          onClick={goToNextPage}
          disabled={!eventBadges.length || viewAllBadges === true}
          sx={{
            borderRadius: 3,
            backgroundColor: '#81a6f7',
            ':disabled': { backgroundColor: '#81a6f7', color: 'whitesmoke' },
          }}
        >
          <Typography variant={'button'}>Next</Typography>
          <ArrowForwardIosRoundedIcon />
        </Button>
      </Box> */}
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
          {badges && badges.length > 0 && !viewAllBadges
            ? badges.map(event => {
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
            : eventBadges && eventBadges.length > 0 && viewAllBadges
            ? eventBadges.map(event => {
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
            : null}
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
              disabled={!badges.length || !eventBadges.length}
              onClick={() => {
                setBadges(prevArray => {
                  const pgNum = pageNumber + 1
                  const newFetch = getPaginationData(pageSize, pgNum)
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
