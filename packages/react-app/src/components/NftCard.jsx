import React from 'react'
import { Box, Button, Card, CardActions, CardMedia, CardContent, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

export default function NftCard(props) {
  const { src, event, title, txLink } = props
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          background:
            'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
          padding: '2px',
          color: '#333333',
          borderRadius: 5,
        }}
        maxWidth={300}
      >
        <Card variant={'outlined'} raised sx={{ borderRadius: 5 }}>
          <CardMedia component={'img'} width={200} image={src} alt={'nftimage'} />
          <CardContent
            sx={{
              background:
                'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
              zIndex: 10,
            }}
          >
            <Typography fontWeight={700}>{'Owner'}</Typography>
            <Typography variant={'body2'} noWrap={false} fontWeight={400} color={'#333333'}>
              {title}
            </Typography>
            <Typography variant={'caption'} fontWeight={700} color={'#333333'}>
              {event.tokenType} {event.payload}
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
              sx={{ background: '#81a6f7', ':hover': { background: '#81a6f7', color: '#fff' } }}
            >
              <Typography variant={'button'}>View Transaction</Typography>
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  )
}
