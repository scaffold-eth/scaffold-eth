import React from 'react'
import { Intro, CityOutskirts, City } from './backgrounds'

const BACKGROUNDS = {
  intro: {
    id: 'intro',
    component: <Intro />
  },
  cityOutskirts: {
    id: 'cityOutskirts',
    component: <CityOutskirts />
  },
  city: {
    id: 'city',
    component: <City />
  }
}

export default BACKGROUNDS
