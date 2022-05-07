import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'

export default function AddressedCard({ badges }) {
  return (
    <>
      <Box
        sx={{
          maxWidth: '255px',
          // padding: '1rem',
          position: 'relative',
          background:
            'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
          padding: '2px',
        }}
      >
        {badges.map(badge => {
          const src = 'https://ipfs.io/ipfs/' + badge.decodedIpfsHash
          return (
            <Card sx={{ width: '250px' }} variant={'outlined'} zIndex={10}>
              <CardMedia component={'img'} width={150} image={src} alt={'nftimage'} />
              <CardContent
                sx={{
                  background:
                    'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
                }}
              >
                <Typography variant={'body2'} fontWeight={400}>
                  {badge.tokenType} {badge.payload}
                </Typography>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </>
  )
}
