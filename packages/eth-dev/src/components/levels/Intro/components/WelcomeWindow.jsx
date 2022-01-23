import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { WindowModal, CodeContainer, Button } from '../../../gameItems/components'

const WelcomeWindow = ({ dialog, actions, isOpen, enterGame }) => {
  const initWidth = window.innerWidth * 0.8
  const initHeight = window.innerHeight * 0.9

  return (
    <WindowModal
      // place window in center of screen
      initTop={window.innerHeight / 2 - initHeight / 2}
      initLeft={window.innerWidth / 2 - initWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={12}
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='windowTitle'
        style={{
          position: 'absolute',
          top: '8%',
          left: '54%',
          width: '31%',
          height: '3%',
          fontSize: '61%',
          color: '#16DC8C'
        }}
      >
        ETH.DEV
      </div>
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          marginTop: '1%',
          overflowY: 'scroll'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#16DC8C' }}>
          Welcome to eth.dev!
        </h2>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          You are about to enter a game which aims to prepare teach you how to navigate the Ethereum
          Blockchain space as a developer. <br />
          You will take the role of a tech savy cryptopunk that skirts the very edge of web3
          hacking.
        </p>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          Alot of the coding challenges are taken from real-world examples.
          <br />
          From apps and protocolls that are live on the Ethereum main chainhandling hundreds of
          millions of $$$.
        </p>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          This is not a game for beginners! <br /> This game is targeted towards more experienced
          developers that are proficient in javascript, nodejs and the basics of solidity.
        </p>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          If you are looking to learn solidity basics may we suggest that you head over to our
          firends at{' '}
          <a href='https://cryptozombies.io' target='_blank' rel='noreferrer'>
            cryptozombies.io
          </a>
          ?
        </p>

        <Button
          style={{ marginTop: 20 }}
          className='is-warning'
          onClick={() => {
            actions.background.setCurrentBackground({ background: 'cityOutskirts' })
            enterGame()
          }}
        >
          Start Journey
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(WelcomeWindow)
