import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'NFTStore'

const NFTStore = ({ dialog, globalGameActions }) => {
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
  }, [])

  const [historyWindowIsVisible, setHistoryWindowVisibility] = useState(false)
  const [contractWindowIsVisible, setContractWindowVisibility] = useState(false)
  const [challengeWindowIsVisible, setChallengeWindowVisibility] = useState(false)

  return (
    <div id='NFTStore'>
      <Terminal
        isOpen
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
        isOpen={challengeWindowIsVisible}
        setContractWindowVisibility={setContractWindowVisibility}
        setChallengeWindowVisibility={setChallengeWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(NFTStore)
