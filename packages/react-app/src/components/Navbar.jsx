import React from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'
import Logo from './Logo'
import MenuItems from './MenuItems'

export default function Navbar(props) {
  const { tabValue, setTabValue } = props
  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar color="inherit" elevation={1}>
          <Toolbar>
            <Logo />
            <MenuItems tabValue={tabValue} setTabValue={setTabValue} />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
