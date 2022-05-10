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
          color: '#333333',
        }}
      >
        {badges.map(badge => {
          const src = 'https://ipfs.io/ipfs/' + badge.decodedIpfsHash
          console.log({ currentBadge: badge })
          return (
            <Card key={badge.decodedIpfsHash} sx={{ zIndex: 10 }} variant={'outlined'}>
              <CardMedia component={'img'} width={200} image={src} alt={'nftimage'} />
              <CardContent
                sx={{
                  background:
                    'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
                }}
              >
                <Typography variant={'h5'} fontWeight={700}>
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
