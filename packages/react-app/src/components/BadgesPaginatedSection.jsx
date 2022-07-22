// @ts-nocheck
import Grid from '@mui/material/Grid'
import NftCard from './NftCard'
import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import { BadgeContext } from 'contexts/BadgeContext'

export default function BadgesPaginatedSection({ eventBadges }) {
  const { contractRef, localProvider, mainnet, etherscanRef } = useContext(BadgeContext)
  const [pageNumber, setPageNumber] = useState(1)

  function getPaginationData(pageSize) {
    const startIndex = pageNumber * pageSize - pageSize
    const endIndex = startIndex + pageSize
    const result = eventBadges.slice(startIndex, endIndex)
    return result
  }

  function goToNextPage() {
    setPageNumber(previousPageNumber => previousPageNumber + 1)
  }

  function goToPreviousPage() {
    setPageNumber(previousPageNumber => previousPageNumber - 1)
  }

  function getPageNumber(evt) {
    // @ts-ignore
    const currentPageNumber = Number(evt.target.textContent)
    return currentPageNumber
  }
  return (
    <>
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
    </>
  )
}
