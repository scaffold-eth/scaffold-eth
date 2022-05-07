import React from 'react'
import { Box, Button, Card, CardActions, CardMedia, CardContent, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

export default function NftCard(props) {
  const { src, event, title, txLink } = props
  return (
    <>
      <Box
        sx={{
          maxWidth: '405px',
          position: 'relative',
          background:
            'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
          padding: '2px',
        }}
      >
        <Card sx={{ width: '400px' }} variant={'outlined'} zIndex={10}>
          <CardMedia component={'img'} width={200} image={src} alt={'nftimage'} />
          <CardContent
            sx={{
              background:
                'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
            }}
          >
            <Typography fontWeight={700}>{'Owner'}</Typography>
            <Typography variant={'body2'} noWrap={false} fontWeight={400}>
              {title}
            </Typography>
            <Typography variant={'body1'} fontWeight={700}>
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
