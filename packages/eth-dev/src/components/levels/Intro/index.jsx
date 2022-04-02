import React, { useEffect, useState } from 'react'

import { Toolbelt, MonologWindow, Terminal, Button } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { InitChainInstructionsWindow } from '../SetupLocalNetwork/components'
import {
  WelcomeWindow,
  IncomingCallBubble,
  SelectLevelWindow,
  FactionSupportOverview
} from './components'
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
    // load level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'Workstation' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/StartMonolog`,
      currentDialog: levelDialog
    })
    // TODO:
    // audio.soundtrack.play()
  }, [])

  const [showWelcomeWindow, setShowWelcomeWindow] = useState(false)
  const [showFactionSupportOverviewWindow, setShowFactionSupportOverviewWindow] = useState(false)

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

  const [initialInstructionsWindowIsVisible, setInitChainInstructionsWindowVisibility] = useState(
    false
  )

  return (
    <div id={`level${LEVEL_ID}`} style={{ height: '100vh', overflow: 'hidden' }}>
      {/* !didEnterGame && !showWelcomeWindow && (
        <div style={{ margin: '20% 30%' }}>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <i id='coin1' className='nes-icon coin is-medium' />
            <i id='coin2' className='nes-icon coin is-medium' />
            <i id='coin3' className='nes-icon coin is-medium' />
          </div>
          <Button
            className='is-warning'
            onClick={() => {
              audio.click.play()
              setShowWelcomeWindow(true)
            }}
          >
            <span style={{ marginLeft: 5, marginRight: 5 }}>Insert Coin</span>
          </Button>
        </div>
          ) */}

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
          setShowWelcomeWindow={setShowWelcomeWindow}
          setShowFactionSupportOverviewWindow={setShowFactionSupportOverviewWindow}
        />
      )}

      {didEnterGame && !didFinishMonolog && !showFactionSupportOverviewWindow && (
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
        <Terminal
          isOpen
          globalGameActions={globalGameActions}
          setInitChainInstructionsWindowVisibility={setInitChainInstructionsWindowVisibility}
        />
      )}

      <InitChainInstructionsWindow
        isOpen={initialInstructionsWindowIsVisible}
        globalGameActions={globalGameActions}
        setInitChainInstructionsWindowVisibility={setInitChainInstructionsWindowVisibility}
      />

      {didEnterGame && (
        <FactionSupportOverview
          isOpen={showFactionSupportOverviewWindow}
          globalGameActions={globalGameActions}
        />
      )}

      <SelectLevelWindow isOpen={false} globalGameActions={globalGameActions} />
    </div>
  )
}

export default wrapGlobalGameData(IntroLevel)
