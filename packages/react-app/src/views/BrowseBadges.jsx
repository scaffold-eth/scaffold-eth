import React, { useState, useEffect, useRef } from 'react'
import { Card } from 'antd'
import externalContracts from '../contracts/external_contracts'
import { useEventListener } from 'eth-hooks/events/useEventListener'
import { useContractLoader } from 'eth-hooks'

import { ethers } from 'ethers'
import { TextField } from '@mui/material'
import multihash from 'multihashes'

export const toHex = ipfsHash => {
  let buf = multihash.fromB58String(ipfsHash)
  return '0x' + multihash.toHexString(buf)
}

export const toBase58 = contentHash => {
  let hex = contentHash.substring(2)
  let buf = multihash.fromHexString(hex)
  return multihash.toB58String(buf)
}

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

  useEffect(async () => {
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
  }, [address])

  const contracts = useContractLoader(localProvider, contractConfig, 10)
  const events = useEventListener(contracts, 'REMIX_REWARD', 'Transfer', localProvider, 1)
  if (contractEvents.length !== events.length) {
    setContractEvents(events)
  }
  console.log(events)

  useEffect(async () => {
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
  }, [address])

  useEffect(async () => {
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
  }, [contractEvents])

  return (
    <div style={{ paddingTop: '36px' }}>
      <svg
        style={{ padding: '24px', fill: '#007aa6', width: '200px', float: 'left', marginTop: '64px' }}
        id="Ebene_2"
        data-name="Ebene 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 105 100"
      >
        <path d="M91.84,35a.09.09,0,0,1-.1-.07,41,41,0,0,0-79.48,0,.09.09,0,0,1-.1.07C9.45,35,1,35.35,1,42.53c0,8.56,1,16,6,20.32,2.16,1.85,5.81,2.3,9.27,2.22a44.4,44.4,0,0,0,6.45-.68.09.09,0,0,0,.06-.15A34.81,34.81,0,0,1,17,45c0-.1,0-.21,0-.31a35,35,0,0,1,70,0c0,.1,0,.21,0,.31a34.81,34.81,0,0,1-5.78,19.24.09.09,0,0,0,.06.15,44.4,44.4,0,0,0,6.45.68c3.46.08,7.11-.37,9.27-2.22,5-4.27,6-11.76,6-20.32C103,35.35,94.55,35,91.84,35Z" />
        <path d="M52,74,25.4,65.13a.1.1,0,0,0-.1.17L51.93,91.93a.1.1,0,0,0,.14,0L78.7,65.3a.1.1,0,0,0-.1-.17L52,74A.06.06,0,0,1,52,74Z" />
        <path d="M75.68,46.9,82,45a.09.09,0,0,0,.08-.09,29.91,29.91,0,0,0-.87-6.94.11.11,0,0,0-.09-.08l-6.43-.58a.1.1,0,0,1-.06-.18l4.78-4.18a.13.13,0,0,0,0-.12,30.19,30.19,0,0,0-3.65-6.07.09.09,0,0,0-.11,0l-5.91,2a.1.1,0,0,1-.12-.14L72.19,23a.11.11,0,0,0,0-.12,29.86,29.86,0,0,0-5.84-4.13.09.09,0,0,0-.11,0l-4.47,4.13a.1.1,0,0,1-.17-.07l.09-6a.1.1,0,0,0-.07-.1,30.54,30.54,0,0,0-7-1.47.1.1,0,0,0-.1.07l-2.38,5.54a.1.1,0,0,1-.18,0l-2.37-5.54a.11.11,0,0,0-.11-.06,30,30,0,0,0-7,1.48.12.12,0,0,0-.07.1l.08,6.05a.09.09,0,0,1-.16.07L37.8,18.76a.11.11,0,0,0-.12,0,29.75,29.75,0,0,0-5.83,4.13.11.11,0,0,0,0,.12l2.59,5.6a.11.11,0,0,1-.13.14l-5.9-2a.11.11,0,0,0-.12,0,30.23,30.23,0,0,0-3.62,6.08.11.11,0,0,0,0,.12l4.79,4.19a.1.1,0,0,1-.06.17L23,37.91a.1.1,0,0,0-.09.07A29.9,29.9,0,0,0,22,44.92a.1.1,0,0,0,.07.1L28.4,47a.1.1,0,0,1,0,.18l-5.84,3.26a.16.16,0,0,0,0,.11,30.17,30.17,0,0,0,2.1,6.76c.32.71.67,1.4,1,2.08a.1.1,0,0,0,.06,0L52,68.16H52l26.34-8.78a.1.1,0,0,0,.06-.05,30.48,30.48,0,0,0,3.11-8.88.1.1,0,0,0-.05-.11l-5.83-3.26A.1.1,0,0,1,75.68,46.9Z" />
      </svg>

      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}

      <div style={{ textAlign: 'left', padding: '10px', color: '#007aa6', marginTop: 64, marginLeft: 20 }}>
        <h1>Remix Rewards</h1>
        <div>
          <h3>
            Remix Project rewards contributors, beta testers, and UX research participants with NFTs deployed on
            Optimism.
            <br />
            Remix Reward holders are able to mint a second “Remixer” user NFT badge to give to any other user of their
            choice (friendlier UX coming soon).
            <br />
            This feature is a way for rewarded Remix contributors to help grow our user base into a larger and more
            genuine open source community of practice.
            <br />
            <br />
            Remix Rewards are currently not transferable. <br />
            This feature leaves open the possibility of granting holders proportional voting power to help the community
            decide on new features for the IDE and/or other issues governing the development of the Remix toolset.
            <br />
            Input a wallet address to see the Remix Rewards it holds:
          </h3>
        </div>
      </div>
      <div style={{ padding: 16, width: '100%', color: '#007aa6', paddingTop: '0px' }}>
        <TextField
          variant="outlined"
          sx={{ marginTop: 2, color: '#007aa6' }}
          label="Address or ENS name"
          onChange={e => {
            setAddress(e.target.value)
          }}
        />
        <div>{error}</div>

        <div style={{ flexWrap: 'wrap', display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
          <div>
            {badges.map(badge => {
              const src = 'https://ipfs.io/ipfs/' + badge.decodedIpfsHash
              return (
                <Card style={{ margin: '12px', width: '500px' }}>
                  {badge.tokenType} {badge.payload}
                  <img width={200} src={src}></img>
                </Card>
              )
            })}
          </div>
        </div>

        <div style={{ flexWrap: 'wrap', display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
          {eventBadges.reverse().map(event => {
            console.log(event)
            const src = 'https://ipfs.io/ipfs/' + toBase58(event.hash)
            const txLink = 'https://optimistic.etherscan.io/tx/' + event.transactionHash
            let title = event.name ? event.name : event.to
            return (
              <Card title={'owner - ' + title} style={{ margin: '12px', width: '500px' }}>
                <img width={200} src={src} />
                {event.tokenType} {event.payload}
                <br />
                <a href={txLink} target="_blank" rel="noreferrer">
                  view transaction
                </a>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
