import React from 'react'
import { Box, Typography, Button } from '@mui/material'

export default function MenuItems() {
  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
          <Typography color={'#4b4b4b'}>Browse Badges</Typography>
        </Button>
        <Button sx={{ my: 2, color: 'prima', display: 'block' }}>
          <Typography color={'#4b4b4b'}>Browse Badges</Typography>
        </Button>
        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
          <Typography color={'#4b4b4b'}>Browse Badges</Typography>
        </Button>
        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
          <Typography color={'#4b4b4b'}>Browse Badges</Typography>
        </Button>
      </Box>
    </>
  )
}
