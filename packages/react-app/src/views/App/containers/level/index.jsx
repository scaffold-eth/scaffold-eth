import React from 'react'
import { UnderflowLevel } from './views/levelContents'
import { connectController } from './controller'

const LevelContainer = ({ currentLevel, children }) => {
  return (
    <div id='levelContainer'>
      <UnderflowLevel />
      {children}
    </div>
  )
}

export default connectController(LevelContainer)
