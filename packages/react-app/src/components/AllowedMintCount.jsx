import Typography from '@mui/material/Typography'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BadgeContext } from 'contexts/BadgeContext'
import externalContracts from 'contracts/external_contracts'
import { getCurrentChainId } from 'helpers/SwitchToOptimism'

export default function AllowedMintCount() {
  // @ts-ignore
  const { contractRef, injectedProvider, connectedAddress } = useContext(BadgeContext)
  /*
   * this returns the number of user badge that the selected account is allowed to mint.
   * this function throws an error if the current network selected in the injected provider (metamask) is not optimism (chain id of optimism is 10)
   */
  const allowedMinting = useCallback(async (contractReference, provider, address) => {
    try {
      let contract = new ethers.Contract(contractReference.address, contractReference.abi, provider)
      return await contract.allowedMinting(address)
    } catch (error) {
      console.error(error)
    }
  }, [])
  const [mintCount, setMintCount] = useState('0')

  useEffect(() => {
    if (injectedProvider === undefined || connectedAddress === undefined) {
      console.log('Not connected to metamask or the blockchain!')
      return
    }
    const run = async () => {
      try {
        const chainId = await getCurrentChainId()
        if (chainId === 5) {
          // create contractRef for goerli
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const contractReference = externalContracts['5'].contracts.REMIX_REWARD
          const result = await allowedMinting(contractReference, provider, contractReference.address)
          setMintCount(result)
        }
        const result = await allowedMinting(contractRef, injectedProvider, connectedAddress)
        console.log({ result })
        setMintCount(result)
      } catch (error) {
        console.log(`There was an error caught in AllowedMintCount. See the details below`)
        console.log({ error })
      }
    }
    run()
    return () => {
      console.log('cleaned up!')
    }
  }, [allowedMinting, connectedAddress, contractRef, injectedProvider])

  useEffect(() => {
    window.ethereum.on('chainChanged', async chainId => {
      if (chainId !== 5) return
      // create contractRef for goerli
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contractReference = externalContracts['5'].contracts.REMIX_REWARD
      const result = await allowedMinting(contractReference, provider, contractReference.address)
      setMintCount(result)
    })
    return () => {
      window.ethereum.removeListener('chainChanged', () => {})
    }
  }, [allowedMinting])

  return (
    <>
      <Typography variant="h2" fontWeight={900} sx={{ padding: 2, color: '#81a6f7' }}>
        {mintCount}
      </Typography>
    </>
  )
}
