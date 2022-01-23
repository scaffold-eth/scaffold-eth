import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ContractWindow, ExplanationWindow } from './components'
import dialogArray from './dialog'

const UnderflowBug = ({ dialog, actions }) => {
  useEffect(() => {
    // set initial level background
    actions.background.setCurrentBackground({ background: 'cityOutskirts' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'underflow-bug/start',
      currentDialog: dialogArray
    })
  }, [])

  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)

  return (
    <div id='underflowBug'>
      <Terminal
        isOpen
        globalGameActions={actions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <ContractWindow isOpen={contractWindowIsVisible} />
      <ExplanationWindow isOpen={explanationWindowIsVisible} />
    </div>
  )
}

export default wrapGlobalGameData(UnderflowBug)
