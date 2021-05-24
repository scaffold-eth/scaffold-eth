import React from 'react'
import { IntroLevel } from './views/levelContents'
import { connectController } from './controller'

const LevelContainer = ({ currentLevel, children }) => {
  return (
    <div id='levelContainer'>
      <IntroLevel />
      {children}
    </div>
  )
}

export default connectController(LevelContainer)
