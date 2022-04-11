import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { HighLevelOverview, ExplanationWindow, RepoInstructionsWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'GnosisSafe'

const GnosisSafe = ({ dialog, globalGameActions }) => {
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
    // show terminal
    globalGameActions.terminal.showTerminal()
  }, [])

  const [highLevelOverviewWindowIsVisible, setHighLevelOverviewWindowIsVisible] = useState(false)
  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)

  return (
    <div id='GnosisSafe'>
      <Terminal
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <RepoInstructionsWindow isOpen />

      <HighLevelOverview
        // isOpen={highLevelOverviewWindowIsVisible}
        isOpen
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />
      <ExplanationWindow
        // isOpen={explanationWindowIsVisible}
        isOpen
        globalGameActions={globalGameActions}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(GnosisSafe)
