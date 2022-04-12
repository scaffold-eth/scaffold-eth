import React from 'react'
import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import {
  DAOContractWindow,
  DarkDAOContractWindow,
  ExplanationWindow,
  FetchIntructionsWindow
} from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'DAOHack'

const DAOHack = () => {
  // --------------------------------
  // set initial level background
  const [backgroundId, setBackgroundId] = useLocalStorage(
    `${LEVEL_ID}-backgroundId`,
    backgroundIds.Workstation
  )

  // set initial dialog index
  const [currentDialogIndex, setCurrentDialogIndex] = useLocalStorage(`${LEVEL_ID}-dialogIndex`, 0)
  const continueDialog = () => setCurrentDialogIndex(currentDialogIndex + 1)

  const [
    dialogPathsVisibleToUser,
    setDialogPathsVisibleToUser
  ] = useLocalStorage(`${LEVEL_ID}-dialogPathsVisibleToUser`, [INITIAL_DIALOG_PART_ID])

  const jumpToDialogPath = ({ dialogPathId }) => {
    // determine new currentDialogIndex
    let updatedCurrentDialogIndex
    levelDialog.map((dialogPart, index) => {
      if (!updatedCurrentDialogIndex && dialogPart.dialogPathId === dialogPathId) {
        updatedCurrentDialogIndex = index
      }
    })
    // add dialogPathId to dialogParts that are visible to the user
    setDialogPathsVisibleToUser([...dialogPathsVisibleToUser, dialogPathId])
    setCurrentDialogIndex(updatedCurrentDialogIndex)
  }
  // --------------------------------

  const [daoContractWindowIsVisible, setDaoContractWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-daoContractWindowIsVisible`,
    false
  )

  const [darkDaoContractWindowIsVisible, setDarkDaoContractWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-darkDaoContractWindowIsVisible`,
    false
  )

  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-explanationWindowIsVisible`,
    false
  )

  const [fetchIntructionsWindowIsVisible, setFetchIntructionsWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-fetchIntructionsWindowIsVisible`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='DAOHack'>
        <Terminal
          isOpen
          showMessageNotification={{
            delayInSeconds: null
          }}
        >
          <TerminalDialogContainer
            levelDialog={levelDialog}
            currentDialogIndex={currentDialogIndex}
            setCurrentDialogIndex={setCurrentDialogIndex}
            continueDialog={continueDialog}
            dialogPathsVisibleToUser={dialogPathsVisibleToUser}
            jumpToDialogPath={jumpToDialogPath}
            setBackgroundId={setBackgroundId}
            //
            setDaoContractWindowVisibility={setDaoContractWindowVisibility}
            setDarkDaoContractWindowVisibility={setDarkDaoContractWindowVisibility}
            setExplanationWindowVisibility={setExplanationWindowVisibility}
          />
        </Terminal>

        <DAOContractWindow isOpen={daoContractWindowIsVisible} />
        <DarkDAOContractWindow isOpen={darkDaoContractWindowIsVisible} />
        <FetchIntructionsWindow isOpen={fetchIntructionsWindowIsVisible} />

        <ExplanationWindow
          isOpen={explanationWindowIsVisible}
          initTop={10}
          initLeft={10}
          continueDialog={continueDialog}
          setDaoContractWindowVisibility={setDaoContractWindowVisibility}
          setDarkDaoContractWindowVisibility={setDarkDaoContractWindowVisibility}
          setExplanationWindowVisibility={setExplanationWindowVisibility}
          setFetchIntructionsWindowVisibility={setFetchIntructionsWindowVisibility}
        />
      </div>
    </>
  )
}

export default DAOHack
