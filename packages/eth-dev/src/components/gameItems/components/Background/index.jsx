import React from 'react'
import { connectController } from './controller'
import backgroundsMap from './backgroundsMap'
import {
  Intro,
  City,
  CityChaos,
  CityOutskirts,
  CitySkylineInsideNight,
  DiceGame,
  NiftyShop,
  RoofSatellite,
  Workstation
} from './backgrounds'

const styles = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
  // background: `url(${pathToCurrentBackground}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  zIndex: -1
}

const Background = ({ currentBackground }) => {
  console.log({ backgroundsMap })
  console.log({ currentBackground })

  return (
    <div
      id='Background'
      className='background-image'
      style={{
        ...styles
      }}
    >
      {backgroundsMap[currentBackground]}
    </div>
  )
}

export default connectController(Background)
