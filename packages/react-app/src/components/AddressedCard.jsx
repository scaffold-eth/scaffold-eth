import React from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
// import InfoIcon from '@mui/icons-material/info'

export default function AddressedCard({ badges }) {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          background:
            'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
          padding: '2px',
          borderRadius: 5,
        }}
        maxWidth={300}
      >
        {badges.map(badge => {
          const src = 'https://ipfs.io/ipfs/' + badge.decodedIpfsHash
          console.log({ currentBadge: badge })
          return (
            <Card key={badge.decodedIpfsHash} sx={{ zIndex: 10, borderRadius: 5 }} variant={'outlined'}>
              <CardMedia component={'img'} width={200} image={src} alt={'nftimage'} />
              <CardContent
                sx={{
                  background:
                    'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
                }}
              >
                <Typography variant={'h5'} fontWeight={700} color={'#333333'}>
                  {badge.tokenType} {badge.payload}
                </Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{
                  background:
                    'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
                }}
              >
                <Button
                  variant={'contained'}
                  // startIcon={<InfoIcon />}
                  fullWidth
                  href={'txLink'}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ background: '#81a6f7', ':hover': { background: '#81a6f7', color: '#fff' } }}
                >
                  <Typography variant={'button'}>View Transaction</Typography>
                </Button>
              </CardActions>
            </Card>
          )
        })}
      </Box>
    </>
  )
}
