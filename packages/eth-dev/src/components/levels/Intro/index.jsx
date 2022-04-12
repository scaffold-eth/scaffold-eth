import React, { useState } from 'react'
import { useLocalStorage } from 'react-use'
import { backgroundIds } from '../../gameItems/components/Background/backgroundsMap'
import {
  TerminalDialogContainer,
  Background,
  MonologWindow,
  Button
} from '../../gameItems/components'

import { WelcomeWindow } from './components'
import levelDialog from './dialog'
import { DIALOG_PART_ID as INITIAL_DIALOG_PART_ID } from './dialog/dialogParts/StartMonolog'

export const LEVEL_ID = 'Intro'

const IntroLevel = () => {
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

  // https://mixkit.co/free-sound-effects/game/
  const audio = {
    soundtrack: new Audio('./assets/sounds/mixkit-game-level-music-689.wav'),
    click: new Audio(
      './assets/sounds/mixkit-quick-positive-video-game-notification-interface-265.wav'
    )
  }

  const [showWelcomeWindow, setShowWelcomeWindow] = useState(false)
  const [showFactionSupportOverviewWindow, setShowFactionSupportOverviewWindow] = useState(false)

  const [didEnterGame, setDidEnterGame] = useState(false)
  const enterGame = () => setDidEnterGame(true)

  const [didFinishMonolog, setDidFinishMonolog] = useState(false)
  const finishMonolog = () => setDidFinishMonolog(true)

  const removeMonologFromDialog = _levelDialog => {
    const dialogWithoutMonolog = _levelDialog.filter(
      part => part.dialogPathId !== `${LEVEL_ID}/StartMonolog`
    )
    return dialogWithoutMonolog
  }

  /*
  useEffect(() => {
    if (didFinishMonolog) {
      globalGameActions.dialog.initDialog({
        initialDialogPathId: `${LEVEL_ID}/FirstContact`,
        currentDialog: removeMonologFromDialog(levelDialog)
      })
    }
  }, [didFinishMonolog])
  */

  return (
    <>
      <Background backgroundId={backgroundId} />

      <div id={`level${LEVEL_ID}`} style={{ height: '100vh', overflow: 'hidden' }}>
        {!showWelcomeWindow && (
          <Button
            className='is-warning'
            style={{
              position: 'absolute',
              top: '28%',
              right: '4%',
              width: '17%'
            }}
            onClick={() => {
              audio.click.play()
              setShowWelcomeWindow(true)
            }}
          >
            <span style={{ marginLeft: 5, marginRight: 5 }}>Enter Game</span>
          </Button>
        )}

        {!didEnterGame && showWelcomeWindow && (
          <WelcomeWindow
            isOpen={showWelcomeWindow}
            enterGame={enterGame}
            setBackgroundId={setBackgroundId}
            setShowWelcomeWindow={setShowWelcomeWindow}
            setShowFactionSupportOverviewWindow={setShowFactionSupportOverviewWindow}
          />
        )}

        {didEnterGame && !didFinishMonolog && !showFactionSupportOverviewWindow && (
          <MonologWindow isOpen={!didFinishMonolog} finishMonolog={finishMonolog}>
            <TerminalDialogContainer
              levelDialog={levelDialog}
              currentDialogIndex={currentDialogIndex}
              setCurrentDialogIndex={setCurrentDialogIndex}
              continueDialog={continueDialog}
              dialogPathsVisibleToUser={dialogPathsVisibleToUser}
              jumpToDialogPath={jumpToDialogPath}
              setBackgroundId={setBackgroundId}
              //
            />
          </MonologWindow>
        )}
      </div>
    </>
  )
}

export default IntroLevel
