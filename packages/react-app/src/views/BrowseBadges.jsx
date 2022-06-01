import React, { useState, useEffect } from 'react'
import externalContracts from '../contracts/external_contracts'
import { useEventListener } from 'eth-hooks/events/useEventListener'
import { useContractLoader } from 'eth-hooks'

import { ethers } from 'ethers'
import { TextField } from '@mui/material'
import multihash from 'multihashes'
import { Typography } from '@mui/material'
import { Box, Grid } from '@mui/material'
import NftCard from '../components/NftCard'
import { Paper } from '@mui/material'
import { FormControl } from '@mui/material'
import AddressedCard from '../components/AddressedCard'

export const toHex = ipfsHash => {
  let buf = multihash.fromB58String(ipfsHash)
  return '0x' + multihash.toHexString(buf)
}

export const toBase58 = contentHash => {
  let hex = contentHash.substring(2)
  let buf = multihash.fromHexString(hex)
  return multihash.toB58String(buf)
}

export const isHexadecimal = value => {
  return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0
}

export default function BrowseBadges({ localProvider, mainnet, selectedChainId, address, setAddress }) {
  const [contractEvents, setContractEvents] = useState([])
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }
  const [badges, setBadges] = useState([])
  const [eventBadges, setEventBadges] = useState([])
  const [error, setErrorMessage] = useState('')

  console.log('current chain', selectedChainId)
  let contractRef
  if (
    externalContracts[selectedChainId] &&
    externalContracts[selectedChainId].contracts &&
    externalContracts[selectedChainId].contracts.REMIX_REWARD
  ) {
    contractRef = externalContracts[selectedChainId].contracts.REMIX_REWARD
  }
  
  /*
   * this mint a user badge from the current selected account
   */
  const mintBadge = async (receiverAddress) => {
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
    mintTx = await contract.publicMint(receiverAddress)
    await mintTx.wait()
  }
  
  /*
   * this returns the number of user badge that the selected account is allowed to mint.
   */
  const allowedMinting = async (currentAccount) => {
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
    return await contract.allowedMinting(currentAccount)    
  }

  async function addressFilterHandler(e) {
    if (!e.target.value) {
      setAddress('')
      return
    }
    if (isHexadecimal(e.target.value.replace('0x', ''))) {
      setAddress(e.target.value)
      setErrorMessage('')
    } else {
      let name = e.target.value
      if (!name.endsWith('.eth')) name = name + '.eth'
      const address = await mainnet.resolveName(name)
      if (address) {
        setAddress(address)
        if (error.length > 1) setErrorMessage('')
      } else {
        setErrorMessage(`${name} not found`)
      }
    }
  }

  useEffect(() => {
    const run = async () => {
      if (!contractRef) return setErrorMessage('chain not supported. ' + selectedChainId)
      if (!address) {
        setBadges([])
        setErrorMessage('')
        return
      }
      setErrorMessage('')
      try {
        let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
        const balance = await contract.balanceOf(address)
        const badges = []
        for (let k = 0; k < balance; k++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(address, k)
            let data = await contract.tokensData(tokenId)
            const badge = Object.assign({}, data, { decodedIpfsHash: toBase58(data.hash) })
            badges.push(badge)
          } catch (e) {
            console.error(e)
          }
        }
        console.log('badges for address', address, badges)
        setBadges(badges)
        setErrorMessage('')
      } catch (e) {
        setErrorMessage(e.message)
      }
    }
    run()
  }, [address, contractRef, localProvider, selectedChainId])

  const contracts = useContractLoader(localProvider, contractConfig, 10)
  const events = useEventListener(contracts, 'REMIX_REWARD', 'Transfer', localProvider, 1)
  if (contractEvents.length !== events.length) {
    setContractEvents(events)
  }
  console.log(events)

  useEffect(() => {
    const run = async () => {
      if (address) {
        return setEventBadges([])
      }
      const eventsDecoded = []
      for (const event of contractEvents) {
        console.log(event.args.to, event.args.tokenId.toString())
        let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
        let data = await contract.tokensData(event.args.tokenId)
        const name = await mainnet.lookupAddress(event.args.to)
        const badge = Object.assign({}, event.args, data, { decodedIpfsHash: toBase58(data.hash) }, event, { name })

        console.log(event.args.to, event.args.tokenId.toString(), badge, event)
        eventsDecoded.push(badge)
      }
      setEventBadges(eventsDecoded)
    }
    run()
  }, [address])

  useEffect(() => {
    const run = async () => {
      if (address) {
        return setEventBadges([])
      }
      const eventsDecoded = []
      for (const event of contractEvents) {
        console.log(event.args.to, event.args.tokenId.toString())
        let contract = new ethers.Contract(contractRef.address, contractRef.abi, localProvider)
        let data = await contract.tokensData(event.args.tokenId)
        const name = await mainnet.lookupAddress(event.args.to)
        const badge = Object.assign({}, event.args, data, { decodedIpfsHash: toBase58(data.hash) }, event, { name })

        console.log(event.args.to, event.args.tokenId.toString(), badge, event)
        eventsDecoded.push(badge)
      }
      setEventBadges(eventsDecoded)
    }
    run()
  }, [contractEvents])

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
            <Typography variant="subtitle1" fontWeight={500} mb={3} sx={{ color: '#333333' }}>
              Remix Project rewards contributors, beta testers, and UX research participants with NFTs deployed on
              Optimism.
              <br />
              Remix Reward holders are able to mint a second “Remixer” user NFT badge to give to any other user of their
              choice (friendlier UX coming soon).
              <br />
              This feature is a way to reward Remix contributors to help grow our user base into a larger and more
              genuine open source community of practice.
            </Typography>
            <Typography variant="subtitle1" fontWeight={500} sx={{ color: '#333333' }}>
              Remix Rewards are currently not transferable. This feature leaves open the possibility of granting holders
              proportional voting power to help the community decide on new features for the IDE and/or other issues
              governing the development of the Remix toolset.
            </Typography>
          </Box>
        </Box>
        <Box mt={8} xs={12} sm={12} md={8}>
          <Typography variant={'h6'} fontWeight={700} fontFamily={'Noah'} mb={3} sx={{ color: '#333333' }}>
            Input a wallet address to see the Remix Rewards it holds:
          </Typography>
          <FormControl sx={{ width: '50vw' }} variant="outlined">
            {/* <InputLabel htmlFor="addressEnsSearch">Address or ENS name</InputLabel> */}
            <TextField
              id="addressEnsSearch"
              sx={{ color: '#007aa6' }}
              label="Address or ENS name"
              onChange={e => {
                addressFilterHandler(e)
              }}
            />
          </FormControl>
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
          maxHeight: '100vh',
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
          {badges && badges.length > 0 ? (
            <Grid item md={'auto'} lg={'auto'} mt={-12} ml={'auto'} mr={'auto'}>
              <AddressedCard badges={badges} />
            </Grid>
          ) : eventBadges && eventBadges.length > 0 ? (
            eventBadges.reverse().map(event => {
              console.log(event)
              const src = 'https://remix-project.mypinata.cloud/ipfs/' + toBase58(event.hash)
              const txLink = 'https://optimistic.etherscan.io/tx/' + event.transactionHash
              let title = event.name ? event.name : event.to
              return (
                <Grid
                  item
                  mt={-12}
                  mb={15}
                  ml={'auto'}
                  mr={'auto'}
                  key={title}
                  alignItems={'center'}
                  justifyContent={'center'}
                  direction={'row'}
                >
                  <NftCard src={src} title={title} txLink={txLink} event={event} />
                </Grid>
              )
            })
          ) : null}
        </Grid>
      </Box>
    </>
  )
}
