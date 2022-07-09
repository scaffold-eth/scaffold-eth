// @ts-nocheck
import React, { useState, useEffect } from 'react'
import externalContracts from '../contracts/external_contracts'
import { getAllRewards } from '../helpers/getAllRewards'

import { ethers } from 'ethers'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import { Search } from '@mui/icons-material'
import multihash from 'multihashes'
import { Typography } from '@mui/material'
import { Box, Grid } from '@mui/material'
import NftCard from '../components/NftCard'
import { Paper } from '@mui/material'
import { FormControl } from '@mui/material'
import { useContext } from 'react'
import { BadgeContext } from 'contexts/BadgeContext'

export const toHex = ipfsHash => {
  let buf = multihash.fromB58String(ipfsHash)
  return '0x' + multihash.toHexString(buf)
}

export const isHexadecimal = value => {
  return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0
}

// const styles

export default function BrowseBadges() {
  const [eventBadges, setEventBadges] = useState([])
  const [error, setErrorMessage] = useState('')
  const { localProvider, mainnet, selectedChainId, address, setAddress } = useContext(BadgeContext)

  let contractRef
  let providerRef
  let etherscanRef
  if (
    externalContracts[selectedChainId] &&
    externalContracts[selectedChainId].contracts &&
    externalContracts[selectedChainId].contracts.REMIX_REWARD
  ) {
    contractRef = externalContracts[selectedChainId].contracts.REMIX_REWARD
    providerRef = externalContracts[selectedChainId].provider
    etherscanRef = externalContracts[selectedChainId].etherscan
  }

  useEffect(() => {
    const run = async () => {
      if (!contractRef) return setErrorMessage('chain not supported. ' + selectedChainId)
      if (!address) {
        setEventBadges([])
        setErrorMessage('')
        return
      }
      setErrorMessage('')
    }
    run()
  }, [address, contractRef, localProvider, selectedChainId])

  const run = async () => {
    if (address) {
      console.log('address o wa!')
      return setEventBadges([])
    }
    let badges = await getAllRewards(contractRef.address, providerRef)
    badges = badges.map((badge) => {
      return {
        id: ethers.utils.hexStripZeros(badge.topics[3]),
        to: ethers.utils.hexStripZeros(badge.topics[2]),
        transactionHash: badge.transactionHash
      }
    })
    setEventBadges(badges)
  }

  useEffect(() => {    
    run()
  }, [])

  useEffect(() => {
    if (address.length > 0) return
    run()
  }, [address])

  async function processAddress(address) {
    setEventBadges([])
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
    console.log({ contract }, 'contract created')
    const balance = await contract.balanceOf(address)
    console.log({ balance }, 'balance created')
    const badges = []
    console.log('badgesCreated')
    try {
      for (let k = 0; k < balance; k++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, k)
        badges.push({
          id: tokenId,
          to: ethers.utils.hexStripZeros(address),
          transactionHash: ''
        })
      }
    } catch (error) {
      console.log(error)
    }
    console.log('forEach finished. badges going to be set')
    setEventBadges(badges)
    console.log('badges set and done')
  }

  async function submitHandler(e) {
    try {
      if (address) {
        if (address.includes('.eth')) {
          let resolvedAddress = await mainnet.resolveName(address)
          if (!resolvedAddress) {
            setErrorMessage(`Could not resolve this address ${address}`)
          }
          await processAddress(resolvedAddress)
        } else {
          await processAddress(address)
        }
      } else {
        setEventBadges([])
        setErrorMessage('')
        return
      }
    } catch (error) {
      setErrorMessage(error)
    }
  }

  return (
    <>
      <Box sx={{ paddingTop: '76px' }}>
        {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
        <Box sx={{ textAlign: 'left', padding: '10px', color: '#007aa6', marginLeft: 5 }}>
          <Typography variant={'h3'} fontWeight={700} sx={{ marginBottom: 5 }} color={'black'} fontFamily={'Noah'}>
            Remix Rewards
          </Typography>
          <Box>
            <Typography variant="inherit" fontWeight={500} mb={3} sx={{ color: '#333333' }}>
              Remix Project rewards contributors, beta testers, and UX research participants with NFTs deployed on
              Optimism.
              <br />
              Remix Reward holders are able to mint a second “Remixer” user NFT badge to give to any other user of their
              choice (friendlier UX coming soon).
              <br />
              This feature is a way to reward Remix contributors to help grow our user base into a larger and more
              genuine open source community of practice.
            </Typography>
            <Typography variant="inherit" fontWeight={500} sx={{ color: '#333333' }}>
              Remix Rewards are currently not transferable. This feature leaves open the possibility of granting holders
              proportional voting power to help the community decide on new features for the IDE and/or other issues
              governing the development of the Remix toolset.
            </Typography>
          </Box>
          <Box></Box>
        </Box>
        <Box mt={8}>
          <Typography variant={'h6'} fontWeight={700} fontFamily={'Noah'} mb={3} sx={{ color: '#333333' }}>
            Input a wallet address to see the Remix Rewards it holds:
          </Typography>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {address.length > 0 ? (
              <IconButton onClick={() => setAddress('')} sx={{ color: '#81a6f7', ':hover': { color: '#1976d2' } }}>
                {'Back to Badge Gallery'}
                <ArrowCircleLeftIcon fontSize="large" />
              </IconButton>
            ) : null}
            <FormControl sx={{ width: '50vw' }} variant="outlined">
              <TextField
                id="addressEnsSearch"
                sx={{ color: '#007aa6' }}
                label="Address or ENS name"
                onChange={e => {
                  setAddress(e.target.value)
                }}
                value={address}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{
                padding: 1.8,
                marginLeft: 3,
                background: '#81a6f7',
                ':disabled': {
                  background: '#81a6f7',
                  color: 'whitesmoke',
                },
              }}
              onClick={e => submitHandler(e)}
              disabled={address === ''}
            >
              <Search />
            </Button>
          </Box>
          {error && error.length > 0 ? (
            <Paper>
              <Typography
                sx={{
                  color: 'red',
                  fontWeight: 700,
                }}
                p={3}
              >
                {error}
              </Typography>
            </Paper>
          ) : null}
        </Box>
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
          {eventBadges && eventBadges.length > 0 ? (
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
                  <NftCard etherscan={etherscanRef} to={event.to} id={event.id} transactionHash={event.transactionHash} contract={contract} mainnet={mainnet} />
                </Grid>
              )
            })
          ) : null}
        </Grid>
      </Box>
    </>
  )
}
