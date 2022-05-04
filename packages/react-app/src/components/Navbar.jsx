import React from 'react'
import { AppBar } from '@mui/material'
import Logo from './Logo'
import MenuItems from './MenuItems'

export default function Navbar() {
  return (
    <>
      <AppBar>
        <Logo />
        <MenuItems />
      </AppBar>
    </>
  )
}
