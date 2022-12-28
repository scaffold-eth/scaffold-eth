import React, { Dispatch, Fragment, ReactNode, SetStateAction } from 'react'
import Navbar from './Navbar'
import { Container } from '@mui/material'
import Footer from './Footer'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  logo: {
    fill: '#2F6DF2', //'#81a6f7',
    width: '35px',
    float: 'left',
    // marginRight: 3,
  },
})

interface LayoutProps {
  children: ReactNode
  tabValue: number
  setTabValue: Dispatch<SetStateAction<number>>
}

export default function Layout(props: LayoutProps) {
  const { children, tabValue, setTabValue } = props
  return (
    <Fragment>
      <Navbar tabValue={tabValue} setTabValue={setTabValue} useStyles={useStyles} />
      <Container maxWidth={false} sx={{ marginBottom: 5 }}>
        {children}
      </Container>
      <Footer />
    </Fragment>
  )
}
