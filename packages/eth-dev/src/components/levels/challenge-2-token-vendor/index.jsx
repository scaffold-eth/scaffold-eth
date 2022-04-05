import React, { useState, useEffect } from 'react'
import { Terminal, UnreadMessagesNotification } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Challenge2TokenVendor'

const Challenge2TokenVendor = ({ dialog, globalGameActions }) => {
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
    // hide terminal
    globalGameActions.terminal.hideTerminal()
    // wait 4 seconds then show unread message notification
    globalGameActions.terminal.showMessageNotification({ delayInSeconds: 4 })
  }, [])

  const [historyWindowIsVisible, setHistoryWindowVisibility] = useState(false)
  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [challengeWindowIsVisible, setChallengeWindowVisibility] = useState(false)

  return (
    <div id='Challenge2TokenVendor'>
      <Terminal
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

export default wrapGlobalGameData(Challenge2TokenVendor)
