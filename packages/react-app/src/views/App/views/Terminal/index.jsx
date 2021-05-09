import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './views'
import './styles.css'

const Terminal = ({ terminalVisible, levelContainer: { currentLevel }, dialogs }) => {
  return (
    <DialogContainer
      terminalVisible={terminalVisible}
      currentLevel={currentLevel}
      dialogs={dialogs}
    />
  )
}

export default connectController(Terminal)
