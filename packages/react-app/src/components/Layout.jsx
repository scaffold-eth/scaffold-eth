import React, { Fragment } from 'react'
import Navbar from './Navbar'
import { Container } from '@mui/material'
import Footer from './Footer'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  logo: {
    fill: '#2F6DF2', //'#81a6f7',
    width: '35px',
    float: 'left',
    marginRight: 5,
  },
})

export default function Layout(props) {
  const { children, tabValue, setTabValue } = props
  return (
    <Fragment>
      <Navbar tabValue={tabValue} setTabValue={setTabValue} useStyles={useStyles} />
      <Container maxWidth={false}>{children}</Container>
      <Footer />
    </Fragment>
  )
}
