import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import {
  DAOContractWindow,
  DarkDAOContractWindow,
  ExplanationWindow,
  FetchIntructionsWindow
} from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'DAOHack'

const DAOHack = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    // globalGameActions.background.setCurrentBackground({ background: 'CitySkylineInsideNight' })
    globalGameActions.background.setCurrentBackground({ background: 'Workstation' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [daoContractWindowIsVisible, setDaoContractWindowVisibility] = useState(false)
  const [darkDaoContractWindowIsVisible, setDarkDaoContractWindowVisibility] = useState(false)
  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useState(false)
  const [fetchIntructionsWindowIsVisible, setFetchIntructionsWindowVisibility] = useState(false)

  return (
    <div id='DAOHack'>
      <Terminal
        isOpen
        initTop={window.innerHeight - 840}
        initLeft={window.innerWidth - 530}
        globalGameActions={globalGameActions}
        setDaoContractWindowVisibility={setDaoContractWindowVisibility}
        setDarkDaoContractWindowVisibility={setDarkDaoContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
      />

      <DAOContractWindow isOpen={daoContractWindowIsVisible} />
      <DarkDAOContractWindow isOpen={darkDaoContractWindowIsVisible} />
      <FetchIntructionsWindow isOpen={fetchIntructionsWindowIsVisible} />

      <ExplanationWindow
        isOpen={explanationWindowIsVisible}
        initTop={10}
        initLeft={10}
        globalGameActions={globalGameActions}
        setDaoContractWindowVisibility={setDaoContractWindowVisibility}
        setDarkDaoContractWindowVisibility={setDarkDaoContractWindowVisibility}
        setExplanationWindowVisibility={setExplanationWindowVisibility}
        setFetchIntructionsWindowVisibility={setFetchIntructionsWindowVisibility}
      />
    </div>
  )
}

export default wrapGlobalGameData(DAOHack)
