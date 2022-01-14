import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './components'
import './styles.css'

const Terminal = ({
  terminalVisible,
  levelContainer: { currentLevel },
  dialog,
  actions,
  globalGameActions,
  ...props
}) => {
  console.log('in Terminal:')
  console.log({ dialog })

  return (
    <DialogContainer
      terminalVisible={terminalVisible}
      currentLevel={currentLevel}
      dialog={dialog}
      actions={actions}
      globalGameActions={globalGameActions}
      parentProps={{ ...props }}
    />
  )
}

export default connectController(Terminal)
