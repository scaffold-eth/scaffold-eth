import React from 'react'
import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { InstructionsWindow } from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'SetupMetamask'

const SetupMetamaskLevel = ({ loadWeb3Modal }) => {
  // --------------------------------
  // set initial level background
  const [backgroundId, setBackgroundId] = useLocalStorage(
    `${LEVEL_ID}-background`,
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

  const [initialInstructionsWindowIsVisible, setInstructionsWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-initialInstructionsWindowIsVisible`,
    true
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='setupMetamask'>
        <Terminal
          isOpen
          initTop={window.innerHeight - 840}
          initLeft={10}
          loadWeb3Modal={loadWeb3Modal}
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
            setInstructionsWindowVisibility={setInstructionsWindowVisibility}
          />
        </Terminal>

        <InstructionsWindow
          isOpen={initialInstructionsWindowIsVisible}
          continueDialog={continueDialog}
          setInstructionsWindowVisibility={setInstructionsWindowVisibility}
        />
      </div>
    </>
  )
}

export default SetupMetamaskLevel
