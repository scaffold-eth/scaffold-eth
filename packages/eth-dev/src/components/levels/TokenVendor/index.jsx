import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'TokenVendor'

const TokenVendor = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'Workstation' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [historyWindowIsVisible, setHistoryWindowVisibility] = useState(false)
  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [challengeWindowIsVisible, setChallengeWindowVisibility] = useState(false)

  return (
    <div id='TokenVendor'>
      <Terminal
        isOpen
        initTop={window.innerHeight - 840}
        initLeft={window.innerWidth - 530}
        globalGameActions={globalGameActions}
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
      />

      <HistoryWindow
        isOpen={historyWindowIsVisible}
        globalGameActions={globalGameActions}
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
      />

      <ContractWindow isOpen={contractWindowIsVisible} />

      <ChallengeWindow
        isOpen={challengeWindowIsVisible}
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(TokenVendor)
