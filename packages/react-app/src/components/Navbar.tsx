import React, { useState } from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'
import Button from '@mui/material/Button'
import Logo from './Logo'
import MenuItems from './MenuItems'
import Account from './Account'
import { NavbarProps } from '../types/rewardTypes'

export default function Navbar(props: NavbarProps) {
  const { tabValue, setTabValue } = props
  const [enableButton] = useState(false)
  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar color="inherit" elevation={1}>
          <Toolbar>
            <Button href="https://remix-project.org">
              <Logo useStyles={props.useStyles} textLeftMargin={2} />
            </Button>
            <MenuItems tabValue={tabValue} setTabValue={setTabValue} />
            <Account minimized={enableButton} />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
