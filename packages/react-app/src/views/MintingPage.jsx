import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MintingPageCard from '../components/MintingPageCard'

export default function MintingPage() {
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
          <Typography variant="subtitle1" fontWeight={500} mb={3} sx={{ color: '#333333' }}>
            Remix project rewards contributors, beta testers and UX research participants with NFTs deployed on
            Optimism. <br /> Remix Reward holders are able to mint a second "Remixer" user NFT badge to give to any
            other user of their choice for every reward they receive.
          </Typography>
          <Box>
            <Typography variant="subtitle1" fontWeight={500} mb={3} sx={{ color: '#333333' }} component={'span'}>
              Minting each "Remixer" badge will require a very small amount of ETH (0.15 DAI) on the Optimism network.{' '}
              <br /> If you do not have ETH on Optimism, you can transfer some from Mainnet using the{' '}
              <a href="https://app.optimism.io/bridge">Optimism Bridge</a> or{' '}
              <a href="https://app.hop.exchange/#/send?sourceNetwork=optimism&destNetwork=ethereum&token=ETH">
                Hop Exchange
              </a>
            </Typography>
            <Box component={'span'} sx={{ shapeOutside: 'inset(150px 100px 50%)', margin: 2 }}>
              <Button variant={'contained'} size={'large'} sx={{ padding: 2, background: '#81a6f7', borderRadius: 3 }}>
                <Typography variant={'button'} fontWeight="bolder">
                  Connect to Mint
                </Typography>
              </Button>
            </Box>
          </Box>
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
      >
        <MintingPageCard />
      </Box>
    </>
  )
}
