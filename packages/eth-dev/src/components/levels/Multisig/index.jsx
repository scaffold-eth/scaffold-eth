import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ContractWindow, ExplanationWindow, RepoInstructionsWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Multisig'

const Multisig = ({ dialog, globalGameActions }) => {
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

  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)

  return (
    <div id='multisig'>
      <Terminal
        isOpen
        // initTop={window.innerHeight - 840}
        // initLeft={window.innerWidth - 530}
        globalGameActions={globalGameActions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <ContractWindow isOpen={contractWindowIsVisible} />
      <RepoInstructionsWindow isOpen />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        globalGameActions={globalGameActions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(Multisig)
