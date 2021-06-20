import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './views'
import './styles.css'

const Terminal = ({ terminalVisible, levelContainer: { currentLevel }, dialog }) => {
  return (
    <DialogContainer
      terminalVisible={terminalVisible}
      currentLevel={currentLevel}
      dialog={dialog}
    />
  )
}

export default connectController(Terminal)
