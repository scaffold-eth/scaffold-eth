import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InstructionsWindow } from './components'
import dialogArray from './dialog'

const ConnectToMetamaskLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set initial level background
    actions.background.setCurrentBackground({ background: 'roofSatellite' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'connect-to-metamask/start',
      currentDialog: dialogArray
    })
  }, [])

  const [initialInstructionsWindowIsVisible, setInstructionsWindowVisibility] = useState(false)

  return (
    <div id='connectToMetamask'>
      <Terminal
        isOpen
        globalGameActions={actions}
        setInstructionsWindowVisibility={setInstructionsWindowVisibility}
      />

      <InstructionsWindow
        isOpen={initialInstructionsWindowIsVisible}
        globalGameActions={actions}
        setInstructionsWindowVisibility={setInstructionsWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(ConnectToMetamaskLevel)
