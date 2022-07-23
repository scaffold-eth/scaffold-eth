// @ts-nocheck
import Grid from '@mui/material/Grid'
import NftCard from './NftCard'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import { BadgeContext } from 'contexts/BadgeContext'

export default function BadgesPaginatedSection({ eventBadges, etherscanRef }) {
  const { contractRef, localProvider, mainnet } = useContext(BadgeContext)
  const [pageNumber, setPageNumber] = useState(1)

  function getPaginationData(pageSize) {
    const startIndex = pageNumber * pageSize - pageSize
    const endIndex = startIndex + pageSize
    const result = eventBadges.slice(startIndex, endIndex)
    return result
  }

  function goToNextPage() {
    setPageNumber(previous => previous + 1)
  }

  function goToPreviousPage() {
    setPageNumber(previous => previous - 1)
  }
  return (
    <>
      <Box mb={15} mt={10} display={'flex'} justifyContent={'space-between'}>
        <Button variant={'contained'} disabled={pageNumber === 1} onClick={goToPreviousPage}>
          <ArrowBackIosNewRoundedIcon />
          <Typography variant={'button'}>Previous</Typography>
        </Button>
        <Button variant={'contained'} onClick={goToNextPage} disabled={!eventBadges.length}>
          <Typography variant={'button'}>Next</Typography>
          <ArrowForwardIosRoundedIcon />
        </Button>
      </Box>
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
          {eventBadges && eventBadges.length > 0
            ? getPaginationData(10).map(event => {
                let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
                console.log({ eventBadges })
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
        </Grid>
      </Box>
    </>
  )
}
