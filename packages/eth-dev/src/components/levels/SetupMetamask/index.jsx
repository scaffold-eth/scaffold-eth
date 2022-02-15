import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InstructionsWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'SetupMetamask'

const SetupMetamaskLevel = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'Workstation' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [initialInstructionsWindowIsVisible, setInstructionsWindowVisibility] = useState(false)

  return (
    <div id='setupMetamask'>
      <Terminal
        isOpen
        initTop={100}
        initLeft={100}
        globalGameActions={globalGameActions}
        setInstructionsWindowVisibility={setInstructionsWindowVisibility}
      />

      <InstructionsWindow
        isOpen={initialInstructionsWindowIsVisible}
        globalGameActions={globalGameActions}
        setInstructionsWindowVisibility={setInstructionsWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(SetupMetamaskLevel)
