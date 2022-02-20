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
  }, [])

  const [initialInstructionsWindowIsVisible, setInitChainInstructionsWindowVisibility] = useState(
    false
  )

  return (
    <div id='setupLocalNetworkLevel'>
      <Terminal
        isOpen
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
