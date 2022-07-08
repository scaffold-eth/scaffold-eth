import Typography from '@mui/material/Typography'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BadgeContext } from 'contexts/BadgeContext'

export default function AllowedMintCount() {
  // @ts-ignore
  const { contractRef, injectedProvider, connectedAddress } = useContext(BadgeContext)
  /*
   * this returns the number of user badge that the selected account is allowed to mint.
   * this function throws an error if the current network selected in the injected provider (metamask) is not optimism (chain id of optimism is 10)
   */
  const allowedMinting = useCallback(async () => {
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, injectedProvider)
    return await contract.allowedMinting(connectedAddress)
  }, [connectedAddress, contractRef.abi, contractRef.address, injectedProvider])
  const [mintCount, setMintCount] = useState(0)

  useEffect(() => {
    if (injectedProvider === undefined || connectedAddress === undefined) {
      console.log('Not connected to metamask or the blockchain!')
      return
    }
    const run = async () => {
      // @ts-ignore
      const result = parseFloat(ethers.utils.formatEther(await allowedMinting()))
      console.log({ result })
      setMintCount(result)
    }
    run()
    return () => {
      console.log('cleaned up!')
    }
  }, [allowedMinting, connectedAddress, injectedProvider])

  return (
    <>
      <Typography variant="h2" fontWeight={900} sx={{ padding: 2, color: '#81a6f7' }}>
        {typeof mintCount === 'number' ? mintCount : 0}
      </Typography>
    </>
  )
}
