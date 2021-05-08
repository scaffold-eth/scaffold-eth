import React from 'react'
import { connectController } from './controller'
import BACKGROUNDS_MAP from './backgroundsMap'

const Background = ({ background }) => {
  return <>{BACKGROUNDS_MAP[background].component}</>
}

export default connectController(Background)
