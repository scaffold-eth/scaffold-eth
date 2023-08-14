import React from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

export default function AddressedCard({ badges, etherscanRef }: { badges: any[], etherscanRef: any}) {
  let track = 0
  return (
    <>
      {badges && badges.length > 0 ? (
        badges.map(badge => {
          const src = 'https://ipfs.io/ipfs/' + badge.decodedIpfsHash
          const txLink = etherscanRef + badge.transactionHash
          return (
            <Box
              sx={{
                position: 'relative',
                padding: '2px',
                color: '#333333',
                borderRadius: 5,
                boxShadow: '1px 1px 4px 0px rgb(170,170,170)',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.05)',
                },
              }}
              maxWidth={310}
              key={`${src}-${track !== badges.length ? track++ : track++}`}
            >
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
                    startIcon={<InfoIcon />}
                    fullWidth
                    href={txLink}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ background: '#81a6f7', ':hover': { background: '#1976d2', color: '#fff' } }}
                  >
                    <Typography variant={'button'} fontWeight={'bolder'}>
                      View Transaction
                    </Typography>
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )
        })
      ) : (
        <>
          <Box
            sx={{
              position: 'relative',
              padding: '2px',
              color: '#333333',
              borderRadius: 5,
            }}
            maxWidth={310}
          >
            <Card>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Card>
          </Box>
        </>
      )}
    </>
  )
}
