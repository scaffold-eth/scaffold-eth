import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Challenge1DecentralizedStaking'

const Challenge1DecentralizedStaking = ({ dialog, globalGameActions }) => {
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
  const [userPickedPositiveResponse, setUserPickedPositiveResponse] = useState(false)

  return (
    <div id='Challenge1DecentralizedStaking'>
      <Terminal
        initTop={window.innerHeight - 840}
        initLeft={window.innerWidth - 530}
        globalGameActions={globalGameActions}
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
        userPickedPositiveResponse={userPickedPositiveResponse}
        setUserPickedPositiveResponse={setUserPickedPositiveResponse}
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
        setHistoryWindowVisibility={setHistoryWindowVisibility}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(Challenge1DecentralizedStaking)
