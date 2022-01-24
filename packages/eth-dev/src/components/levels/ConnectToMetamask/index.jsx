import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InstructionsWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'ConnectToMetamask'

const ConnectToMetamaskLevel = ({ dialog, globalGameActions }) => {
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
    <div id='connectToMetamask'>
      <Terminal
        isOpen
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

export default wrapGlobalGameData(ConnectToMetamaskLevel)
