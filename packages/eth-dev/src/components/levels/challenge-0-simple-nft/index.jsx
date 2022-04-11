import React, { useState, useEffect } from 'react'
import { Terminal, UnreadMessagesNotification } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Challenge0SimpleNFT'

const Challenge0SimpleNFT = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'City' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
    // show terminal
    globalGameActions.terminal.showTerminal()
  }, [])

  const [historyWindowIsVisible, setHistoryWindowVisibility] = useState(false)
  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [challengeWindowIsVisible, setChallengeWindowVisibility] = useState(false)

  return (
    <div id='Challenge0SimpleNFT'>
      <Terminal
        initTop={window.innerHeight - 840}
        initLeft={window.innerWidth - 530}
        globalGameActions={globalGameActions}
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />

      <HistoryWindow
        isOpen={historyWindowIsVisible}
        globalGameActions={globalGameActions}
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />

      <ContractWindow isOpen={contractWindowIsVisible} />

      <ChallengeWindow
        isOpen
        // isOpen={challengeWindowIsVisible}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(Challenge0SimpleNFT)
