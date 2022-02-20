import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ContractWindow, ExplanationWindow, EtherDeltaWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'DecentralizedExchange'

const DecentralizedExchange = ({ dialog, globalGameActions }) => {
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
  const [etherDeltaWindowIsVisible, setEtherDeltaWindowVisibility] = useState(false)

  return (
    <div id='decentralizedExchange'>
      <Terminal
        isOpen
        initTop={window.innerHeight * 0.1}
        initLeft={window.innerWidth * 0.95 - (450 + 10)}
        // initTop={window.innerHeight - (700 + 10)}
        // initLeft={window.innerWidth - (450 + 10)}
        globalGameActions={globalGameActions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <EtherDeltaWindow isOpen={etherDeltaWindowIsVisible} />

      <ContractWindow isOpen={contractWindowIsVisible} />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        initTop={10}
        initLeft={10}
        globalGameActions={globalGameActions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
        setEtherDeltaWindowVisibility={setEtherDeltaWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(DecentralizedExchange)
