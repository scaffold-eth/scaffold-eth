import React, { useState } from 'react'
import { Tabs } from '@mui/material'
import { Tab } from '@mui/material'

const menuNames = ['Browse Badges']

export default function MenuItems() {
  const [tabValue, setTabValue] = useState(0)
  return (
    <>
      <Tabs
        sx={{
          marginLeft: 'auto',
        }}
        value={tabValue}
        onChange={(evt, value) => setTabValue(value)}
      >
        {menuNames && menuNames.length ? (
          menuNames.map(name => (
            <Tab
              key={name}
              label={name}
              sx={{
                fontWeight: '700',
              }}
            />
          ))
        ) : (
          <Tab
            label={'BrowseBadges'}
            sx={{
              fontWeight: '700',
            }}
          />
        )}
      </Tabs>
    </>
  )
}
