import React from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'
import Logo from './Logo'
import { Container } from '@mui/material'
import { Button } from '@mui/material'
import { Typography } from '@mui/material'

export default function Navbar() {
  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar color="inherit">
          <Toolbar>
            <Container>
              <Logo />
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                  <Typography color={'#4b4b4b'}>Browse Badges</Typography>
                </Button>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
