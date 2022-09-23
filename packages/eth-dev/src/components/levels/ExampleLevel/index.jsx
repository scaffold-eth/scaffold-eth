import React from 'react'

import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { ExampleTerminal, ExampleWindow, ContractWindow, GitHubWindow } from './components'

import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'ExampleLevel'

const ExampleLevel = () => {
  // --------------------------------
  // set initial level background
  const [backgroundId, setBackgroundId] = useLocalStorage(
    `${LEVEL_ID}-backgroundId`,
    backgroundIds.City
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

  const [ExampleWindowIsVisible, setExampleWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-ExampleWindowIsVisible`,
    false
  )
  const [contractWindowIsVisible, setContractWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-contractWindowIsVisible`,
    false
  )
  const [GitHubWindowIsVisible, setGithubWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-GitHubWindowIsVisible`,
    false
  )
  const [ExampleTerminalIsVisible, setExampleTerminalVisibility] = useLocalStorage(
    `${LEVEL_ID}-ExampleTerminalIsVisible`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id='ExampleLevel'>
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
            setExampleWindowVisibility={setExampleWindowVisibility}
            setContractWindowVisibility={setContractWindowVisibility}
            setGithubWindowVisibility={setGithubWindowVisibility}
            setExampleTerminalVisibility={setExampleTerminalVisibility}
            
          />
        </Terminal>

        <ExampleWindow
          isOpen={ExampleWindowIsVisible}
          continueDialog={continueDialog}
          setExampleWindowVisibility={setExampleWindowVisibility}
          setContractWindowVisibility={setContractWindowVisibility}
          setGithubWindowVisibility={setGithubWindowVisibility}
        />

        <ContractWindow isOpen={contractWindowIsVisible} />

        <GitHubWindow
          isOpen={GitHubWindowIsVisible}
          continueDialog={continueDialog}
          setContractWindowVisibility={setContractWindowVisibility}
          setGithubWindowVisibility={setGithubWindowVisibility}
        />

        <ExampleTerminal
          isOpen={ExampleTerminalIsVisible}
          continueDialog={continueDialog}
          setExampleTerminalVisibility={setExampleTerminalVisibility}
        />
      </div>
    </>
  )
}

export default ExampleLevel
