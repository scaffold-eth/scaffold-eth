import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InitChainInstructionsWindow, ExampleGameActionsWindow } from './components'
import dialogArray from './dialog'

const SetupLocalNetworkLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set initial level background
    actions.background.setCurrentBackground({ background: 'cityOutskirts' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'setup-local-network/start',
      currentDialog: dialogArray
    })
  }, [])

  const [initialInstructionsWindowIsVisible, setInitChainInstructionsWindowVisibility] = useState(
    false
  )

  return (
    <div id='setupLocalNetworkLevel'>
      <Terminal
        isOpen
        globalGameActions={actions}
        setInitChainInstructionsWindowVisibility={setInitChainInstructionsWindowVisibility}
      />

      <InitChainInstructionsWindow
        isOpen={initialInstructionsWindowIsVisible}
        globalGameActions={actions}
        setInitChainInstructionsWindowVisibility={setInitChainInstructionsWindowVisibility}
      />

      <ExampleGameActionsWindow isOpen={false} />
    </div>
  )
}

export default wrapGlobalGameData(SetupLocalNetworkLevel)
