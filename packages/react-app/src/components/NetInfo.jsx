import Typography from '@mui/material/Typography'
import { getCurrentChainId } from 'helpers/SwitchToOptimism'
import { useEffect } from 'react'

export function NetInfo({ netInfo, setNetInfo, connectedAddress, checkForWeb3Provider }) {
  useEffect(() => {
    if (checkForWeb3Provider() === 'Not Found') return
    window.ethereum.on('chainChanged', async chainId => {
      console.log('inside netinfo', { chainId })
      const chainInfo = await getCurrentChainId()
      console.log('current chain', { chainInfo })
      setNetInfo(chainInfo)
    })
  }, [checkForWeb3Provider, setNetInfo])
  return (
    <>
      {netInfo && netInfo.length > 0 && connectedAddress && connectedAddress.length > 1
        ? netInfo.map(n => (
            <Typography
              key={n.chainId}
              component={'span'}
              variant={'caption'}
              ml={2}
              fontWeight={600}
              color={'#ff0420'}
              alignItems={'center'}
              justifyContent={'center'}
            >{`You are connected to ${n.name}`}</Typography>
          ))
        : null}
    </>
  )
}
