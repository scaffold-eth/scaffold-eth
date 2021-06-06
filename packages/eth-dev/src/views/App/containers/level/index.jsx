import React from 'react'
import { connectController } from './controller'
import levels from '../../views/levels'

const LevelContainer = ({ currentLevel, children }) => {
  const LevelContainerContent = levels[currentLevel].levelContainerContent
  return (
    <div id='levelContainer'>
      <LevelContainerContent />

      {children}
    </div>
  )
}

export default connectController(LevelContainer)
