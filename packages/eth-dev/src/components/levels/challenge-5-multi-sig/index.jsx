import React from 'react'

import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { ContractWindow, ExplanationWindow, RepoInstructionsWindow } from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'Challenge5MultiSig'

const Challenge5MultiSig = () => {
  // --------------------------------
  // set initial level background
  const [backgroundId, setBackgroundId] = useLocalStorage(
    `${LEVEL_ID}-backgroundId`,
    backgroundIds.CitySkylineInsideNight
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

  const [contractWindowIsVisible, setContractWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-contractWindowIsVisible`,
    false
  )
  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-explanationWindowIsVisible`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='Challenge5MultiSig'>
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
            setContractWindowVisibility={setContractWindowVisibility}
            setExplanationWindowVisibility={setExplanationWindowVisibility}
          />
        </Terminal>

        <ContractWindow isOpen={contractWindowIsVisible} />
        <RepoInstructionsWindow isOpen />

        <ExplanationWindow
          isOpen={explanationWindowIsVisible}
          setContractWindowVisibility={setContractWindowVisibility}
          setExplanationWindowVisibility={setExplanationWindowVisibility}
          continueDialog={continueDialog}
        />
      </div>
    </>
  )
}

export default Challenge5MultiSig
