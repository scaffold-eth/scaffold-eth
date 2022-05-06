import React from 'react'
import { Button, Card, CardActions, CardMedia, CardContent, Typography } from '@mui/material'

export default function NftCard(props) {
  const { src, event, title, txLink } = props
  return (
    <>
      <Card sx={{ margin: '1px', width: '250px' }}>
        <CardMedia component={'img'} width={150} image={src} alt={'nftimage'} />
        <CardContent>
          <Typography>{'Owner'}</Typography>
          <Typography variant={'caption'} noWrap={false} fontSize={9} fontWeight={400}>
            {title}
          </Typography>
          <Typography variant={'body2'} fontWeight={400}>
            {event.tokenType} {event.payload}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button variant={'contained'} fullWidth href={txLink} target="_blank" rel="noreferrer">
            <Typography variant={'button'}>View Transaction</Typography>
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
