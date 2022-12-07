import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { BadgeContext } from '../contexts/BadgeContext'
import Fab from '@mui/material/Fab'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useCallback } from 'react'
import AddressedCard from './AddressedCard'
import RewardGroupCard from './RewardGroupCard'
import { BadgesPaginatedSectionProps } from '../types/rewardTypes'

export default function BadgesPaginatedSection({
  badges,
  checkeventBagesAndBadges,
  etherscanRef,
  eventBadges,
  groupedRewards,
}: BadgesPaginatedSectionProps) {
  const pageSize = 10
  // @ts-ignore
  const { contractRef, localProvider, mainnet } = useContext(BadgeContext)
  const contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
  const [pageNumber, setPageNumber] = useState(1)
  const [pagedBadges, setPagedBadges] = useState<Array<any>>([])
  const mobileResponsiveMatch = useMediaQuery('(min-width:600px)')
  const getPaginationData = useCallback(
    (pgSize: number, pgNumber: number) => {
      console.log({ eventBadges })
      const startIndex = pgNumber * pgSize - pgSize
      const endIndex = startIndex + pgSize
      const result = eventBadges.slice(startIndex, endIndex)
      return result
    },
    [eventBadges],
  )

  const loadMore = async () => {
    setPageNumber(prev => prev + 1)
    setPagedBadges((prevArray: any[]) => {
      const result = [...new Set([...prevArray, ...eventBadges])]
      return result
    })
  }

  useEffect(() => {
    if (pagedBadges.length === 0) {
      setPagedBadges([...new Set(getPaginationData(pageSize, pageNumber))])
    }
  }, [pagedBadges.length, getPaginationData, pageNumber, pageSize])

  let count = 0
  let len = badges.length

  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={{
          background: 'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
        }}
        mt={15}
      >
        <Grid
          container
          spacing={1}
          ml={'auto'}
          mr={'auto'}
          mt={5}
          paddingRight={3}
          paddingLeft={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 1.3, md: 2 }}
        >
          {checkeventBagesAndBadges(badges) ? (
            <Grid
              item
              mt={-12}
              mb={15}
              ml={'auto'}
              mr={'auto'}
              key={`AddressedCard-${badges && count !== len ? count++ : count++}`}
              alignItems={'left'}
              justifyContent={'left'}
            >
              <AddressedCard badges={badges} etherscanRef={etherscanRef} />
            </Grid>
          ) : groupedRewards && Object.keys(groupedRewards).length > 0 ? (
            Object.keys(groupedRewards).map(eventKey => {
              return (
                <Grid
                  item
                  mt={-12}
                  mb={15}
                  ml={'auto'}
                  mr={'auto'}
                  key={`${eventKey}`}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <RewardGroupCard etherscan={etherscanRef} event={groupedRewards[eventKey]} mainnet={mainnet} />
                </Grid>
              )
            })
          ) : null}
        </Grid>

        {pagedBadges.length === Object.keys(groupedRewards).length ? null : (
          <Box display={'flex'} justifyContent={'right'} paddingRight={2}>
            <Fab
              variant={'extended'}
              size="large"
              sx={{
                position: 'sticky',
                bottom: mobileResponsiveMatch ? 590 : 400,
                top: mobileResponsiveMatch ? 805 : 400,
                alignItems: 'right',
                justifyContent: 'right',
                alignSelf: 'end',
                marginBottom: 5,
                color: 'whitesmoke',
                ':hover': {
                  backgroundColor: '#1565c0',
                },
                padding: 3,
                backgroundColor: '#81a6f7',
              }}
              disabled={!eventBadges.length}
              onClick={loadMore}
            >
              <DownloadingRoundedIcon sx={{ marginRight: 2, fontSize: 48 }} />
              <Typography variant="button" fontWeight={'700'}>
                Load More
              </Typography>
            </Fab>
          </Box>
        )}
      </Box>
    </>
  )
}
