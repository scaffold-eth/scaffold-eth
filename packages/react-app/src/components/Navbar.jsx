import React, { useState } from 'react'
import { AppBar, Toolbar, Box, Menu, MenuItem } from '@mui/material'
import Logo from './Logo'
import MenuItems from './MenuItems'
import { Typography } from '@mui/material'
import { Container } from '@mui/material'

const pages = ['Browse Badges']

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget)
  }
  return (
    <>
      <AppBar color="default" ele>
        <Toolbar>
          <Container>
            <Box>
              <Logo />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                // onClose={() => {})}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map(page => (
                  <MenuItem key={page}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  )
}
