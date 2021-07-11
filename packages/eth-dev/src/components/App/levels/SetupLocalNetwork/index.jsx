import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InitChainInstructionsWindow, ExampleGameActionsWindow } from './components'
import Dialog from './Dialog'

const SetupLocalNetworkLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'city' })
  }, [])

  const [initialInstructionsWindowVisible, setInitChainInstructionsWindowVisibility] = useState(false)

  return (
    <div id='setupLocalNetworkLevel'>
      <Terminal>
        <Dialog
          dialog={dialog}
          actions={{ ...actions, setInitChainInstructionsWindowVisibility }}
        />
      </Terminal>

      <InitChainInstructionsWindow isOpen={initialInstructionsWindowVisible} />

      <ExampleGameActionsWindow />
    </div>
  )
}

export default wrapGlobalGameData(SetupLocalNetworkLevel)
