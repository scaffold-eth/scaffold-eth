import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

export default function MintingActions({ allowedMinting, mintBadge, address }) {
  const [mintingCount, setMintingCount] = useState(0)
  return (
    <>
      <Box display="flex" justifyContent={'space-between'} alignItems={'center'}>
        <Box component="span" onLoad={() => {
          allowedMinting()
        }}
        >

        </Box>
        <Box component="span">
          <Button
            onClick={(e) => {
              mintBadge(address)
            }}
          >
            <Typography
              variant="button"
              fontWeight={600}
              sx={{ borderRadius: 5, marginTop: 5, padding: 1.8, marginLeft: 3, background: '#81a6f7' }}
            >
              {'Mint Badge'}
            </Typography>
          </Button>
        </Box>
      </Box>
    </>
  )
}
