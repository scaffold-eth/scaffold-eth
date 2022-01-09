import React from 'react'
import Typist from 'react-typist'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { WindowModal, CodeContainer, Button } from '../../../gameItems/components'

const WelcomeWindow = ({ dialog, actions, isOpen, enterGame }) => {
  const initHeight = 380
  const initWidth = window.innerWidth / 2

  return (
    <WindowModal
      // place window in center of screen
      initTop={window.innerHeight / 2 - initHeight / 2}
      initLeft={window.innerWidth / 2 - initWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      //
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '5%', paddingLeft: 20, paddingRight: 20 }}
    >
      <div
        style={{
          marginTop: '50px',
          padding: '10px 50px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#16DC8C' }}>Welcome to eth.dev!</h2>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          A game that teaches you how to create dapps on Ethereum and Ethereum compatible chains.
        </p>
      </div>
      <Button
        className='is-warning'
        onClick={() => {
          actions.background.setCurrentBackground({ background: 'cityOutskirts' })
          enterGame()
        }}
      >
        Enter
      </Button>
    </WindowModal>
  )
}

export default wrapGlobalGameData(WelcomeWindow)
