import React from 'react'
import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import { Terminal, TerminalDialogContainer, Background } from '../../gameItems/components'

import { ExplanationWindow, WhatIsABondingCurveWindow, PriceSensitivityWindow } from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/Start'

export const LEVEL_ID = 'BondingCurves'

const BondingCurves = () => {
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

  const [explanationWindowIsVisible, setExplanationWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-explanationWindowIsVisible`,
    false
  )

  const [
    whatIsABondingCurveWindowVisibile,
    setWhatIsABondingCurveWindowVisibility
  ] = useLocalStorage(`${LEVEL_ID}-whatIsABondingCurveWindowVisibile`, false)

  const [priceSensitivityWindowIsVisible, setPriceSensitivityWindowVisibility] = useLocalStorage(
    `${LEVEL_ID}-priceSensitivityWindowIsVisible`,
    false
  )

  return (
    <>
      <Background backgroundId={backgroundId} />
      <div id='bondingCurves'>
        <Terminal
          isOpen
          initTop={window.innerHeight - 840}
          initLeft={window.innerWidth - 530}
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
            setExplanationWindowVisibility={setExplanationWindowVisibility}
          />
        </Terminal>

        <ExplanationWindow
          isOpen={explanationWindowIsVisible}
          initTop={10}
          initLeft={10}
          continueDialog={continueDialog}
          setWhatIsABondingCurveWindowVisibility={setWhatIsABondingCurveWindowVisibility}
          setPriceSensitivityWindowVisibility={setPriceSensitivityWindowVisibility}
        />

        <WhatIsABondingCurveWindow isOpen={whatIsABondingCurveWindowVisibile} />

        <PriceSensitivityWindow isOpen={priceSensitivityWindowIsVisible} />
      </div>
    </>
  )
}

export default BondingCurves
