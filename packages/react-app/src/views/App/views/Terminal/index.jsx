import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './views'
import './styles.css'

const Terminal = ({ terminalVisible }) => {
  return <DialogContainer terminalVisible={terminalVisible} />
}

export default connectController(Terminal)
