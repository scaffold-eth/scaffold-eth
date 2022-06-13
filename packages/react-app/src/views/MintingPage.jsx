import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MintingPageCard from '../components/MintingPageCard'
import { ethers } from 'ethers'
import externalContracts from '../contracts/external_contracts'
import { useState } from 'react'
import FormGroup from '@mui/material/FormGroup'
import TextField from '@mui/material/TextField'

export default function MintingPage({ selectedChainId, injectedProvider, connectedAddress, wallet }) {
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
    return await contract.allowedMinting()
  }
  const [mintCount] = useState(async () => await allowedMinting())
  const [walletAddress, setWalletAddress] = useState('')
  console.log({ mintCount })

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
        <MintingPageCard top={-62} />
        <Box>
          <Box sx={{ background: 'white' }} width={250}>
            <Typography variant="h4" sx={{ padding: 2 }}>
              {typeof mintCount === 'number' ? mintCount : 0}
            </Typography>
            <Typography variant="subtitle1" color={'#0c0c0c'}>
              BADGES REMAINING TO MINT ON YOUR ACCT
            </Typography>
          </Box>
          <Box pt={5}>
            <Typography fontWeight={600}>Input a wallet address</Typography>
            <FormGroup sx={{ paddingTop: 5 }}>
              <TextField
                placeholder="Address or ENS name"
                variant="outlined"
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
              />
            </FormGroup>
          </Box>
        </Box>
      </Box>
    </>
  )
}
