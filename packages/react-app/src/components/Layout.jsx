import React, { Fragment } from 'react'
import Navbar from './Navbar'
import { Container } from '@mui/material'

export default function Layout({ children }) {
  return (
    <Fragment>
      <Container>
        <Navbar />
        {children}
      </Container>
    </Fragment>
  )
}
