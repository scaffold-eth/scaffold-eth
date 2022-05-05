import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Tabs } from '@mui/material'
import { Tab } from '@mui/material'

export default function MenuItems() {
  const [tabValue, setTabValue] = useState()
  return (
    <>
      <Tabs sx={{ marginLeft: 'auto' }} value={tabValue} onChange={(evt, value) => setTabValue(value)}>
        <Tab label="Browse Badge" />
        <Tab label="About RemixIDE" />
        <Tab label="Contact Us" />
        <Tab label="Meet the Team" />
      </Tabs>
    </>
  )
}
