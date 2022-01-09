import React, { useEffect, useState } from 'react'
import { MonologWindow, Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { NewWindow, WelcomeWindow, IncomingCallBubble } from './components'
import Dialog from './Dialog'

const IntroLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'intro' })
  }, [])

  const [didEnterGame, setDidEnterGame] = useState(false)
  const enterGame = () => setDidEnterGame(true)

  const [didFinishMonolog, setDidFinishMonolog] = useState(false)
  const finishMonolog = () => setDidFinishMonolog(true)

  const [didPickUpCall, setDidPickUpCall] = useState(false)
  const pickUpCall = () => setDidPickUpCall(true)

  return (
    <div id='introLevel'>
      {!didEnterGame && <WelcomeWindow isOpen enterGame={enterGame} />}

      {didEnterGame && !didFinishMonolog && (
        <MonologWindow isOpen dialog={dialog}>
          <Dialog dialog={dialog} actions={actions} finishMonolog={finishMonolog} />
        </MonologWindow>
      )}

      {didFinishMonolog && !didPickUpCall && (
        <IncomingCallBubble actions={actions} pickUpCall={pickUpCall} />
      )}

      {didEnterGame && didFinishMonolog && didPickUpCall && (
        <Terminal isOpen dialog={dialog}>
          <Dialog dialog={dialog} actions={actions} finishMonolog={finishMonolog} />
        </Terminal>
      )}
    </div>
  )
}

export default wrapGlobalGameData(IntroLevel)
