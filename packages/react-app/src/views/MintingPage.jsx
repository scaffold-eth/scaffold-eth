import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
            Optimism.
          </Typography>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Button variant={'contained'} size={'larger'} sx={{ padding: 2 }}>
              <Typography variant={'button'} fontWeight="bolder">
                Connect to Mint
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}
