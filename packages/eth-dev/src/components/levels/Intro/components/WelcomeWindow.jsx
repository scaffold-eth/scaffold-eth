import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { WindowModal, CodeContainer, Button } from '../../../gameItems/components'

const WelcomeWindow = ({ dialog, actions, isOpen, enterGame }) => {
  const initWidth = 420
  const initHeight = 430

  return (
    <WindowModal
      initTop={window.innerHeight / 2 - initHeight / 2}
      initLeft={window.innerWidth / 2 - initWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={10}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '5%', paddingLeft: 20, paddingRight: 20 }}
    >
      <div
        className='windowTitle'
        style={{
          position: 'absolute',
          top: '7%',
          left: '54%',
          width: '31%',
          height: '3%',
          fontSize: '61%',
          color: '#16DC8C'
        }}
      >
        ETH.DEV
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#16DC8C' }}>Welcome to eth.dev!</h2>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          A game that teaches you how to create dapps on Ethereum and Ethereum compatible chains.
        </p>
        <Button
          className='is-warning'
          onClick={() => {
            actions.background.setCurrentBackground({ background: 'cityOutskirts' })
            enterGame()
          }}
        >
          Enter
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(WelcomeWindow)
