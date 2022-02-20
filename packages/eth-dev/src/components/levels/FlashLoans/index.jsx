import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ContractWindow, ExplanationWindow, EtherDeltaWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'FlashLoans'

const FlashLoans = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'CitySkylineInsideNight' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)

  return (
    <div id='flashLoans'>
      <Terminal
        isOpen
        initTop={window.innerHeight - (700 + 10)}
        initLeft={window.innerWidth - (450 + 10)}
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        initTop={10}
        initLeft={10}
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(FlashLoans)
