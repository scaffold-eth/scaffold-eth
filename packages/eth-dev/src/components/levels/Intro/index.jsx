import React, { useEffect, useState } from 'react'
import { Toolbelt, MonologWindow, Terminal, Button } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { WelcomeWindow, IncomingCallBubble } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Intro'

const IntroLevel = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'Intro' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/StartMonolog`,
      currentDialog: levelDialog
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
  const removeMonologFromDialog = _levelDialog => {
    const dialogWithoutMonolog = _levelDialog.filter(
      part => part.dialogPathId !== `${LEVEL_ID}/StartMonolog`
    )
    return dialogWithoutMonolog
  }

  useEffect(() => {
    if (didFinishMonolog) {
      globalGameActions.dialog.initDialog({
        initialDialogPathId: `${LEVEL_ID}/FirstContact`,
        currentDialog: removeMonologFromDialog(levelDialog)
      })
    }
  }, [didFinishMonolog])

  return (
    <div id={`level${LEVEL_ID}`}>
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
          globalGameActions={globalGameActions}
          finishMonolog={finishMonolog}
        />
      )}

      {didFinishMonolog && !didPickUpCall && (
        <IncomingCallBubble globalGameActions={globalGameActions} pickUpCall={pickUpCall} />
      )}

      {didEnterGame && didFinishMonolog && didPickUpCall && (
        <Terminal isOpen globalGameActions={globalGameActions} />
      )}
    </div>
  )
}

export default wrapGlobalGameData(IntroLevel)
