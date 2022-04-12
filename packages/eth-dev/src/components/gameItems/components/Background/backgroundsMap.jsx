import React from 'react'

import {
  Intro,
  CityOutskirts,
  City,
  CityChaos,
  CitySkylineInsideNight,
  DiceGame,
  NiftyShop,
  RoofSatellite,
  Workstation,
  ExchangeRed,
  ExchangeStonks
} from './backgrounds'

const backgroundsMap = {
  Intro: <Intro />,
  CityOutskirts: <CityOutskirts />,
  City: <City />,
  CityChaos: <CityChaos />,
  CitySkylineInsideNight: <CitySkylineInsideNight />,
  DiceGame: <DiceGame />,
  NiftyShop: <NiftyShop />,
  RoofSatellite: <RoofSatellite />,
  Workstation: <Workstation />,
  ExchangeRed: <ExchangeRed />,
  ExchangeStonks: <ExchangeStonks />
}

const backgroundIds = {
  Intro: 'Intro',
  CityOutskirts: 'CityOutskirts',
  City: 'City',
  CityChaos: 'CityChaos',
  CitySkylineInsideNight: 'CitySkylineInsideNight',
  DiceGame: 'DiceGame',
  NiftyShop: 'NiftyShop',
  RoofSatellite: 'RoofSatellite',
  Workstation: 'Workstation',
  ExchangeRed: 'ExchangeRed',
  ExchangeStonks: 'ExchangeStonks'
}

export { backgroundsMap, backgroundIds }
