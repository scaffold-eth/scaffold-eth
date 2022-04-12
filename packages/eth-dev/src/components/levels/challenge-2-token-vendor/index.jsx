import React from 'react'

import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'Challenge2TokenVendor'

const Challenge2TokenVendor = () => {
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

  const [terminalIsVisible, setTerminalIsVisible] = useLocalStorage(
    `${LEVEL_ID}-terminalIsVisible`,
    false
  )

  const [historyWindowIsVisible, setHistoryWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-historyWindowIsVisible`,
    false
  )

  const [contractWindowIsVisible, setContractWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-contractWindowIsVisible`,
    false
  )

  const [challengeWindowIsVisible, setChallengeWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-challengeWindowIsVisible`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='Challenge2TokenVendor'>
        <Terminal
          isOpen={terminalIsVisible}
          showTerminal={() => setTerminalIsVisible(true)}
          showMessageNotification={{
            delayInSeconds: 4
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
            setHistoryWindowVisibility={setHistoryWindowVisibility}
            setChallengeWindowVisibility={setChallengeWindowVisibility}
            setContractWindowVisibility={setContractWindowVisibility}
          />
        </Terminal>

        <HistoryWindow
          isOpen={historyWindowIsVisible}
          setHistoryWindowVisibility={setHistoryWindowVisibility}
          setChallengeWindowVisibility={setChallengeWindowVisibility}
          setContractWindowVisibility={setContractWindowVisibility}
        />

        <ContractWindow isOpen={contractWindowIsVisible} />

        <ChallengeWindow
          isOpen={challengeWindowIsVisible}
          continueDialog={continueDialog}
          setHistoryWindowVisibility={setHistoryWindowVisibility}
          setChallengeWindowVisibility={setChallengeWindowVisibility}
          setContractWindowVisibility={setContractWindowVisibility}
        />
      </div>
    </>
  )
}

export default Challenge2TokenVendor
