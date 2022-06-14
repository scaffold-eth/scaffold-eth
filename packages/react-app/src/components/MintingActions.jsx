import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'

export default function MintingActions({
  walletAddress,
  mintBadge,
  allowedMinting,
  mintCount,
  setMintCount,
  handleChange,
  WalletAddressTextField,
}) {
  return (
    <>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <Box sx={{ background: 'white' }} width={250}>
          <Typography variant="h3" fontWeight={900} sx={{ padding: 1.5, color: '#81a6f7' }}>
            {typeof mintCount === 'number' ? mintCount : 0}
          </Typography>
          <Typography variant="subtitle1" color={'#0c0c0c'}>
            BADGES REMAINING TO <br /> MINT ON YOUR ACCT
          </Typography>
        </Box>
        <Box pt={5}>
          <Typography fontWeight={600}>Input a wallet address</Typography>
          <FormControl sx={{ width: '50vw' }}>
            <WalletAddressTextField
              label="Address or ENS name"
              variant="outlined"
              value={walletAddress}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Button
          sx={{
            background: '#81a6f7',
            marginTop: 3,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          size={'large'}
          onClick={() => {
            mintBadge(walletAddress)
          }}
        >
          <Typography variant={'subtitle1'} color={'white'} fontWeight={600}>
            Mint Badge
          </Typography>
        </Button>
      </Box>
    </>
  )
}
