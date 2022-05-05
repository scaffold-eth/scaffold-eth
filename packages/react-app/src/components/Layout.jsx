import React, { Fragment } from 'react'
import Navbar from './Navbar'
import { Container } from '@mui/material'

export default function Layout({ children }) {
  return (
    <Fragment>
      <Navbar />
      <Container>{children}</Container>
    </Fragment>
  )
}
