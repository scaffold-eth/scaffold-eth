import React, { useEffect, useState } from 'react'
import { MonologWindow, Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { NewWindow, WelcomeWindow, IncomingCallBubble } from './components'
import dialogArray from './dialog/dialogArray'

const IntroLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set background
    actions.background.setCurrentBackground({ background: 'intro' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'intro/start-monolog',
      currentDialog: dialogArray
    })
  }, [])

  const [didEnterGame, setDidEnterGame] = useState(false)
  const enterGame = () => setDidEnterGame(true)

  const [didFinishMonolog, setDidFinishMonolog] = useState(false)
  const finishMonolog = () => setDidFinishMonolog(true)

  const [didPickUpCall, setDidPickUpCall] = useState(false)
  const pickUpCall = () => setDidPickUpCall(true)

  const removeMonologFromDialog = _dialogArray => {
    const dialogWithoutMonolog = _dialogArray.filter(
      part => part.dialogPathId !== 'intro/start-monolog'
    )
    return dialogWithoutMonolog
  }

  useEffect(() => {
    if (didFinishMonolog) {
      actions.dialog.initDialog({
        initialDialogPathId: 'intro/first-contact',
        currentDialog: removeMonologFromDialog(dialogArray)
      })
    }
  }, [didFinishMonolog])

  return (
    <div id='introLevel'>
      {!didEnterGame && <WelcomeWindow isOpen enterGame={enterGame} />}

      {didEnterGame && !didFinishMonolog && (
        <MonologWindow
          isOpen={!didFinishMonolog}
          globalGameActions={actions}
          finishMonolog={finishMonolog}
        />
      )}

      {didFinishMonolog && !didPickUpCall && (
        <IncomingCallBubble actions={actions} pickUpCall={pickUpCall} />
      )}

      {didEnterGame && didFinishMonolog && didPickUpCall && (
        <Terminal isOpen globalGameActions={actions} />
      )}
    </div>
  )
}

export default wrapGlobalGameData(IntroLevel)
