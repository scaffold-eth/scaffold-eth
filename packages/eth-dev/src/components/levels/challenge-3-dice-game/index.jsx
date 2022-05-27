import React from 'react'

import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { ContractWindow, ChallengeWindow } from './components'

import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'Challenge3DiceGame'

const Challenge3DiceGame = () => {
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

      <div id='Challenge3DiceGame'>
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
            
            setContractWindowVisibility={setContractWindowVisibility}
            setChallengeWindowVisibility={setChallengeWindowVisibility}
          />
        </Terminal>

        <ContractWindow isOpen={contractWindowIsVisible} />

        <ChallengeWindow
          isOpen={challengeWindowIsVisible}
          continueDialog={continueDialog}
          setContractWindowVisibility={setContractWindowVisibility}
          setChallengeWindowVisibility={setChallengeWindowVisibility}
        />
      </div>
    </>
  )
}

export default Challenge3DiceGame
