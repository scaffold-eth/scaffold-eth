// @ts-nocheck
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MintingPageCard from '../components/MintingPageCard'
import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import MintingActions from 'components/MintingActions'
import { BadgeContext } from 'contexts/BadgeContext'

const WalletAddressTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#2b2b2b',
    padding: '10px 10px',
  },
}))

export default function MintingPage({ selectedChainId, injectedProvider }) {
  const { contractRef, connectedAddress } = useContext(BadgeContext)

  /*
   * this mint a user badge from the current selected account
   * this function throws an error
   *  - if the current network selected in the injected provider (metamask) is not optimism (chain id of optimism is 10)
   *  - if the current user doesn't have anymore a slot for minting a badge
   */
  const mintBadge = async receiverAddress => {
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, injectedProvider)
    let mintTx = await contract.publicMint(receiverAddress)
    await mintTx.wait()
  }

  /*
   * this returns the number of user badge that the selected account is allowed to mint.
   * this function throws an error if the current network selected in the injected provider (metamask) is not optimism (chain id of optimism is 10)
   */
  async function allowedMinting() {
    let contract = new ethers.Contract(contractRef.address, contractRef.abi, injectedProvider)
    return await contract.allowedMinting(connectedAddress)
  }
  const [mintCount, setMintCount] = useState(0)
  const [walletAddress, setWalletAddress] = useState('')

  function handleChange(e) {
    setWalletAddress(e.target.value)
  }

  return (
    <>
      <Box pt="76px">
        <Box sx={{ textAlign: 'left', padding: '10px', color: '#007aa6', marginLeft: 5 }}>
          <Typography
            textAlign={'left'}
            variant={'h3'}
            fontWeight={700}
            sx={{ marginBottom: 5 }}
            color={'black'}
            fontFamily={'Noah'}
          >
            Mint a Remixer
          </Typography>
          <Typography variant="h6" fontWeight={500} mb={3} sx={{ color: '#333333' }}>
            Remix project rewards contributors, beta testers and UX research participants with NFTs deployed on
            Optimism. <br />
            For every Remix Reward you have received, you are able to mint one additional "Remixer" badge to a different
            wallet of your choice. <br />
            See below for the number of "Remixer" badge mints you have remaining on your account. <br />
            To mint a new "Remixer" badge, input a unique wallet address below.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
          height: '100vh',
        }}
        mt={15}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
      >
        <MintingPageCard top={-52} />
        <Box mt={5}>
          <MintingActions
            mintCount={mintCount}
            setMintCount={setMintCount}
            mintBadge={mintBadge}
            allowedMinting={allowedMinting}
            walletAddress={walletAddress}
            handleChange={handleChange}
            WalletAddressTextField={WalletAddressTextField}
          />
        </Box>
      </Box>
    </>
  )
}
