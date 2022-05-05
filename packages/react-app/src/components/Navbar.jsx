import React from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'
import Logo from './Logo'
import { Container } from '@mui/material'
import MenuItems from './MenuItems'

export default function Navbar() {
  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar color="inherit">
          <Toolbar>
            <Container>
              <Logo />
              <MenuItems />
            </Container>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
