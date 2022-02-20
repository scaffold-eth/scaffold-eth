import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { DAOContractWindow, DarkDAOContractWindow, ExplanationWindow } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'DAOHack'

const DAOHack = ({ dialog, globalGameActions }) => {
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

  const [daoContractWindowIsVisible, setDaoContractWindowVisibility] = useState(false)
  const [darkDaoContractWindowIsVisible, setDarkDaoContractWindowVisibility] = useState(false)
  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)

  return (
    <div id='DAOHack'>
      <Terminal
        isOpen
        initTop={window.innerHeight - (700 + 10)}
        initLeft={window.innerWidth - (450 + 10)}
        globalGameActions={globalGameActions}
        setDaoContractWindowVisibility={setDaoContractWindowVisibility}
        setDarkDaoContractWindowVisibility={setDarkDaoContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <DAOContractWindow isOpen={daoContractWindowIsVisible} />
      <DarkDAOContractWindow isOpen={darkDaoContractWindowIsVisible} />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        initTop={10}
        initLeft={10}
        globalGameActions={globalGameActions}
        setDaoContractWindowVisibility={setDaoContractWindowVisibility}
        setDarkDaoContractWindowVisibility={setDarkDaoContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(DAOHack)
