import React from 'react'
import { Intro, City, CityOutskirts, CitySkylineInsideNight, Workstation } from './backgrounds'

const backgroundMap = {
  intro: <Intro />,
  city: <City />,
  cityOutskirts: <CityOutskirts />,
  citySkylineInsideNight: <CitySkylineInsideNight />,
  workstation: <Workstation />
}

export default background => backgroundMap[background]
