import React from 'react'
import { connectController } from './controller'

const LevelContainer = ({ currentLevel, children }) => {
  return <div id='levelContainer'>{children}</div>
}

export default connectController(LevelContainer)
