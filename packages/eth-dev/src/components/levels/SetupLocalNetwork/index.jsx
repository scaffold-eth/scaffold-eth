import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InitChainInstructionsWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'SetupLocalNetwork'

const SetupLocalNetworkLevel = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'CityOutskirts' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
    // show terminal
    globalGameActions.terminal.showTerminal()
  }, [])

  const [initialInstructionsWindowIsVisible, setInitChainInstructionsWindowVisibility] = useState(
    true
  )

  return (
    <div id='setupLocalNetworkLevel'>
      <Terminal
        globalGameActions={globalGameActions}
        setInitChainInstructionsWindowVisibility={setInitChainInstructionsWindowVisibility}
      />

      <InitChainInstructionsWindow
        isOpen={initialInstructionsWindowIsVisible}
        globalGameActions={globalGameActions}
        setInitChainInstructionsWindowVisibility={setInitChainInstructionsWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(SetupLocalNetworkLevel)
