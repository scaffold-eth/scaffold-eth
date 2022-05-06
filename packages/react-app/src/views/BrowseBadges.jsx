import React, { useState, useEffect } from 'react'
import externalContracts from '../contracts/external_contracts'
import { useEventListener } from 'eth-hooks/events/useEventListener'
import { useContractLoader } from 'eth-hooks'
import { styled } from '@mui/material/styles'
import './view-style.css'

import { ethers } from 'ethers'
import { TextField } from '@mui/material'
import multihash from 'multihashes'
import { Typography } from '@mui/material'
import { Box, Grid } from '@mui/material'
import NftCard from '../components/NftCard'

export const toHex = ipfsHash => {
  let buf = multihash.fromB58String(ipfsHash)
  return '0x' + multihash.toHexString(buf)
}

export const toBase58 = contentHash => {
  let hex = contentHash.substring(2)
  let buf = multihash.fromHexString(hex)
  return multihash.toB58String(buf)
}

const BadgeBox = styled(Box)(() => ({
  background: `url('../wave-bg.svg') no-repeat`,
}))

export default function BrowseBadges({ localProvider, mainnet, selectedChainId }) {
  const [contractEvents, setContractEvents] = useState([])
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }
  const [address, setAddress] = useState('')
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
  }, [address])

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
    <div style={{ paddingTop: '36px' }}>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}

      <div style={{ textAlign: 'left', padding: '10px', color: '#007aa6', marginTop: 64, marginLeft: 20 }}>
        <Typography variant={'h2'} fontWeight={700} sx={{ marginBottom: 5 }}>
          Remix Rewards
        </Typography>
        <Box>
          <Typography variant="subtitle1" fontWeight={500} mb={3}>
            Remix Project rewards contributors, beta testers, and UX research participants with NFTs deployed on
            Optimism.
            <br />
            Remix Reward holders are able to mint a second “Remixer” user NFT badge to give to any other user of their
            choice (friendlier UX coming soon).
            <br />
            This feature is a way to reward Remix contributors to help grow our user base into a larger and more genuine
            open source community of practice.
          </Typography>
          <Typography variant="subtitle1" fontWeight={500}>
            Remix Rewards are currently not transferable. This feature leaves open the possibility of granting holders
            proportional voting power to help the community decide on new features for the IDE and/or other issues
            governing the development of the Remix toolset.
          </Typography>
        </Box>
      </div>
      <Box style={{ padding: 16, width: '100%', color: '#007aa6', paddingTop: '0px' }}>
        <TextField
          variant="outlined"
          sx={{ marginTop: 2, color: '#007aa6' }}
          label="Address or ENS name"
          onChange={e => {
            setAddress(e.target.value)
          }}
        />
        <div>{error}</div>
      </Box>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
        }}
        mt={15}
      >
        <Grid container spacing={2}>
          {eventBadges.reverse().map(event => {
            console.log(event)
            const src = 'https://ipfs.io/ipfs/' + toBase58(event.hash)
            const txLink = 'https://optimistic.etherscan.io/tx/' + event.transactionHash
            let title = event.name ? event.name : event.to
            return (
              <Grid item xs={6} md={4} lg={'auto'} mt={-12} mb={15}>
                <NftCard src={src} title={title} txLink={txLink} event={event} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </div>
  )
}
