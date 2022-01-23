import React, { useEffect, useState } from 'react'
import { Toolbelt, WindowModal, MonologWindow, Terminal, Button } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { WelcomeWindow, IncomingCallBubble } from './components'
import dialogArray from './dialog'

const IntroLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set initial level background
    actions.background.setCurrentBackground({ background: 'intro' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'intro/start-monolog',
      currentDialog: dialogArray
    })
  }, [])

  const [showWelcomeWindow, setShowWelcomeWindow] = useState(false)

  const [didEnterGame, setDidEnterGame] = useState(false)
  const enterGame = () => setDidEnterGame(true)

  const [didFinishMonolog, setDidFinishMonolog] = useState(false)
  const finishMonolog = () => setDidFinishMonolog(true)

  const [didPickUpCall, setDidPickUpCall] = useState(false)
  const pickUpCall = () => setDidPickUpCall(true)

  // TODO: abstract this into the dialog redux wrapper
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
      {!didEnterGame && !showWelcomeWindow && (
        <div style={{ margin: '25% 30%' }}>
          <Button
            className='is-warning'
            onClick={() => {
              setShowWelcomeWindow(true)
            }}
          >
            Insert Coin
          </Button>
        </div>
      )}

      {!didEnterGame && showWelcomeWindow && <WelcomeWindow isOpen enterGame={enterGame} />}

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
