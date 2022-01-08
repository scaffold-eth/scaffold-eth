import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InitChainInstructionsWindow, ExampleGameActionsWindow } from './components'
import Dialog from './Dialog'

const SetupLocalNetworkLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'city' })
  }, [])

  const [initialInstructionsWindowVisible, setInitChainInstructionsWindowVisibility] = useState(
    false
  )
  const [sessionKey, setSessionKey] = useState(true)

  const levelActions = {
    ...actions,
    setSessionKey,
    setInitChainInstructionsWindowVisibility
  }

  return (
    <div id='setupLocalNetworkLevel'>
      <Terminal>
        <Dialog dialog={dialog} actions={levelActions} />
      </Terminal>

      <InitChainInstructionsWindow isOpen={initialInstructionsWindowVisible} />

      <ExampleGameActionsWindow isOpen={false} />
    </div>
  )
}

export default wrapGlobalGameData(SetupLocalNetworkLevel)
