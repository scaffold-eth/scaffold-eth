import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ContractWindow, ExplanationWindow, EtherDeltaWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Challenge3Dex'

const Challenge3Dex = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'RoofSatellite' })
    // globalGameActions.background.setCurrentBackground({ background: 'ExchangeRed' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
    // show terminal
    globalGameActions.terminal.showTerminal()
  }, [])

  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)
  const [etherDeltaWindowIsVisible, setEtherDeltaWindowVisibility] = useState(false)
  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [challengeWindowIsVisible, setChallengeWindowVisibility] = useState(false)

  return (
    <div id='Challenge3Dex'>
      <Terminal
        initTop={window.innerHeight * 0.1}
        initLeft={window.innerWidth * 0.95 - (450 + 10)}
        globalGameActions={globalGameActions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        initTop={10}
        initLeft={10}
        globalGameActions={globalGameActions}
        setContractWindowVisibility={setContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
        setEtherDeltaWindowVisibility={setEtherDeltaWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />

      <EtherDeltaWindow isOpen={etherDeltaWindowIsVisible} />

      <ContractWindow isOpen={contractWindowIsVisible} />

      <ChallengeWindow
        isOpen={challengeWindowIsVisible}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(Challenge3Dex)
