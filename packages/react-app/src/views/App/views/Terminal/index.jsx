import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './views'
import './styles.css'

const Terminal = ({ terminalVisible, levelContainer: { currentLevel } }) => {
  return <DialogContainer terminalVisible={terminalVisible} currentLevel={currentLevel} />
}

export default connectController(Terminal)
