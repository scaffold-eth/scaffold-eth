import React from 'react'

import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { HistoryWindow, ContractWindow, ChallengeWindow } from './components'

import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'Challenge1DecentralizedStaking'

const Challenge1DecentralizedStaking = () => {
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
  const [userPickedPositiveResponse, setUserPickedPositiveResponse] = useLocalStorage(
    `${LEVEL_ID}-userPickedPositiveResponse`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='Challenge1DecentralizedStaking'>
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
            setContractWindowVisibility={setContractWindowVisibility}
            setChallengeWindowVisibility={setChallengeWindowVisibility}
            userPickedPositiveResponse={userPickedPositiveResponse}
            setUserPickedPositiveResponse={setUserPickedPositiveResponse}
          />
        </Terminal>

        <HistoryWindow
          isOpen={historyWindowIsVisible}
          setHistoryWindowVisibility={setHistoryWindowVisibility}
          setContractWindowVisibility={setContractWindowVisibility}
          setChallengeWindowVisibility={setChallengeWindowVisibility}
        />

        <ContractWindow isOpen={contractWindowIsVisible} />

        <ChallengeWindow
          isOpen={challengeWindowIsVisible}
          continueDialog={continueDialog}
          setHistoryWindowVisibility={setHistoryWindowVisibility}
          setContractWindowVisibility={setContractWindowVisibility}
          setChallengeWindowVisibility={setChallengeWindowVisibility}
        />
      </div>
    </>
  )
}

export default Challenge1DecentralizedStaking
