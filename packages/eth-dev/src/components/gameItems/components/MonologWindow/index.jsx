import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './components'
import './styles.css'

const MonologWindow = ({
  monologVisible,
  levelContainer: { currentLevel },
  dialog,
  actions,
  globalGameActions,
  ...props
}) => {
  return (
    <DialogContainer
      monologVisible={monologVisible}
      currentLevel={currentLevel}
      dialog={dialog}
      actions={actions}
      globalGameActions={globalGameActions}
      parentProps={{ ...props }}
    />
  )
}

export default connectController(MonologWindow)
