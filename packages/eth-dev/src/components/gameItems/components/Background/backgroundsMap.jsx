import React from 'react'
import { Intro, City, CityOutskirts, CitySkylineInsideNight, Workstation, CityAtWar } from './backgrounds'

const backgroundMap = {
  intro: <Intro />,
  city: <City />,
  cityOutskirts: <CityOutskirts />,
  citySkylineInsideNight: <CitySkylineInsideNight />,
  workstation: <Workstation />,
  cityAtWar: <CityAtWar />
}

export default background => backgroundMap[background]
