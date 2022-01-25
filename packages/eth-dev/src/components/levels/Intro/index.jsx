import React, { useEffect, useState } from 'react'

import { Toolbelt, MonologWindow, Terminal, Button } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { WelcomeWindow, IncomingCallBubble } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'Intro'

const IntroLevel = ({ dialog, globalGameActions }) => {
  // https://mixkit.co/free-sound-effects/game/
  const audio = {
    soundtrack: new Audio('./assets/sounds/mixkit-game-level-music-689.wav'),
    click: new Audio(
      './assets/sounds/mixkit-quick-positive-video-game-notification-interface-265.wav'
    )
  }

  useEffect(() => {
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'Intro' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/StartMonolog`,
      currentDialog: levelDialog
    })
    // TODO:
    // audio.soundtrack.play()
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
    <div id={`level${LEVEL_ID}`} style={{ height: '100vh', overflow: 'hidden' }}>
      {!didEnterGame && !showWelcomeWindow && (
        <div style={{ margin: '20% 30%' }}>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <i id='coin1' className='nes-icon coin is-medium' />
            <i id='coin2' className='nes-icon coin is-medium' />
            <i id='coin3' className='nes-icon coin is-medium' />
          </div>
          <Button
            className='is-warning'
            onClick={() => {
              // eslint-disable-next-line no-undef
              audio.click.play()
              setShowWelcomeWindow(true)
            }}
          >
            <span style={{ marginLeft: 5, marginRight: 5 }}>Insert Coin</span>
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
