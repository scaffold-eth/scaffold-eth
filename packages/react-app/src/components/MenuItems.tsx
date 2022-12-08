import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { MenuItemsProps } from '../types/rewardTypes'

const browseBage = {
  name: 'Browse',
  url: '/',
  component: 'a',
}
const mintBadge = {
  name: 'Mint A Badge',
  url: '/mintbadge',
  // component: 'button',
}

const aboutRewards = {
  name: 'About Rewards',
  url: '/about',
}

export default function MenuItems(props: MenuItemsProps) {
  const { tabValue, setTabValue } = props
  function handleChange(evt: any, newValue: any) {
    console.log({ newValue })
    setTabValue(newValue)
  }
  return (
    <>
      <Tabs
        sx={{
          marginLeft: 'auto',
        }}
        value={tabValue}
        onChange={handleChange}
      >
        <Tab
          key={browseBage.name}
          label={browseBage.name}
          sx={{
            fontWeight: '700',
          }}
        />
        <Tab
          key={mintBadge.name}
          label={mintBadge.name}
          sx={{
            fontWeight: '700',
          }}
        />
        <Tab
          key={aboutRewards.name}
          label={aboutRewards.name}
          sx={{
            fontWeight: '700',
          }}
        />
        <Tab
          label={'Head to Remix IDE'}
          sx={{
            fontWeight: 700,
          }}
          href={'https://remix.ethereum.org'}
          target={'_blank'}
          rel={'noreferrer'}
          onClick={() => setTabValue(0)}
        />
      </Tabs>
    </>
  )
}
