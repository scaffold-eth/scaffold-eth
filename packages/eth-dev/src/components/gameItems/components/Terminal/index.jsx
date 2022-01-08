import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './components'
import './styles.css'

const Terminal = ({ terminalVisible, levelContainer: { currentLevel }, dialog, children }) => {
  return (
    <DialogContainer terminalVisible={terminalVisible} currentLevel={currentLevel} dialog={dialog}>
      {children}
    </DialogContainer>
  )
}

export default connectController(Terminal)
