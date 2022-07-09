import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import AllowedMintCount from './AllowedMintCount'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { BadgeContext } from 'contexts/BadgeContext'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material'

const WalletAddressTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#2b2b2b',
  },
}))

export default function MintingActions({ contractRef }) {
  const [message, setMessage] = useState('')
  /*
   * this mint a user badge from the current selected account
   * this function throws an error
   *  - if the current network selected in the injected provider (metamask) is not optimism (chain id of optimism is 10)
   *  - if the current user doesn't have anymore a slot for minting a badge
   */
  // @ts-ignore
  const { injectedProvider } = useContext(BadgeContext)

  const mintBadge = async receiverAddress => {
    if (injectedProvider === undefined) {
      // console.log('Provider is in an invalid state please connect to metamask first!')
      return
    }
    if (receiverAddress === '' || receiverAddress === undefined || receiverAddress === null) {
      // console.log('the form must have an input with a valid account hash!')
      return
    }
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, injectedProvider)
    // console.log({ contract })
    try {
      setMessage('Please approve the transaction and wait for the validation')
      let mintTx = await contract.publicMint(receiverAddress)
      // console.log({ mintTx })
      await mintTx.wait()
      setMessage('Transaction validated')
    } catch (e) {
      setMessage('error while sending the transaction. ' + e.setMessage)
    }   
    setTimeout(() => setMessage(''), 10000)
  }
  const [walletAddress, setWalletAddress] = useState('')

  function handleChange(e) {
    setWalletAddress(e.target.value)
  }

  const doMinting = async () => {
    await mintBadge(walletAddress)
  }

  useEffect(() => {
    // console.log({ injectedProvider, mintingActions: mintBadge })
  }, [])
  return (
    <>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} mt={5}>
        <Box display={'flex'} flexDirection={'column'} sx={{ background: 'white' }} width={280} height={180}>
          <AllowedMintCount />
          <Typography variant="subtitle1" color={'#0c0c0c'} alignItems={'flex-end'} justifyContent={'flex-end'}>
            BADGES REMAINING TO <br /> MINT ON YOUR ACCT
          </Typography>
        </Box>
        <Box pt={2}>
          <Typography fontWeight={600} mb={3}>
            Input a wallet address
          </Typography>
          <FormControl sx={{ width: '50vw' }} variant="outlined">
            <WalletAddressTextField label="Address or ENS name" value={walletAddress} onChange={handleChange} />
          </FormControl>
        </Box>
        <Button
          sx={{
            background: '#81a6f7',
            ':hover': { background: '#1976d2', color: '#fff' },
            marginTop: 2,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          size={'large'}
          onClick={doMinting}
        >
          <Typography variant={'subtitle1'} color={'white'} fontWeight={600}>
            Mint Badge
          </Typography>          
        </Button>
        <span>{message}</span>
      </Box>
    </>
  )
}
