import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ExplanationWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'ENS'

const ENS = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'RoofSatellite' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)

  return (
    <div id='ENS'>
      <Terminal
        isOpen
        initTop={window.innerHeight - 850}
        initLeft={50}
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(ENS)
