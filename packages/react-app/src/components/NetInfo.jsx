import Typography from '@mui/material/Typography'
import { getCurrentChainId } from 'helpers/SwitchToOptimism'
import { useEffect } from 'react'

export function NetInfo({ netInfo, setNetInfo, connectedAddress, checkForWeb3Provider }) {
  useEffect(() => {
    if (checkForWeb3Provider() === 'Not Found') console.log('Metamask is not installed!')
    window.ethereum.on('chainChanged', async chainId => {
      const chainInfo = await getCurrentChainId()
      setNetInfo(chainInfo)
    })

    return () => {
      if (checkForWeb3Provider() === 'Not Found') {
        console.log('Metamask is not installed!')
        return
      }
      window.ethereum.removeListener('chainChanged', () => console.log('removed chainChanged from NetInfo'))
    }
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
              color={n.chainId === 10 ? '#f01a37' : n.chainId === 5 ? '#0975F6' : '#ff8b9e'}
              alignItems={'center'}
              justifyContent={'center'}
            >{`You are connected to ${n.name}`}</Typography>
          ))
        : null}
    </>
  )
}
