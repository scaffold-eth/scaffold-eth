import React, { useState } from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'
import Logo from './Logo'
import MenuItems from './MenuItems'
import Account from './Account'

export default function Navbar(props) {
  const { tabValue, setTabValue } = props
  const [enableButton] = useState(false)
  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar color="inherit" elevation={1}>
          <Toolbar>
            <Logo useStyles={props.useStyles} />
            <MenuItems tabValue={tabValue} setTabValue={setTabValue} />
            <Account minimized={enableButton} />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
