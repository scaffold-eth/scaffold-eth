/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import Typist from 'react-typist'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { SpeechBubble } from '../../../gameItems/components'

const IncomingCallBubble = ({ globalGameActions, pickUpCall }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        height: '100px',
        width: '300px',
        cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer'
      }}
      onClick={() => pickUpCall()}
    >
      <SpeechBubble>
        <Typist cursor={{ show: false }} avgTypingDelay={50} loop>
          Incoming call ...
        </Typist>
      </SpeechBubble>
    </div>
  )
}

export default wrapGlobalGameData(IncomingCallBubble)
