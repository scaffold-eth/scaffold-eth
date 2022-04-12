import React from 'react'

import { backgroundIds } from '../../../gameItems/components/Background/backgroundsMap'
import { WindowModal, Button } from '../../../gameItems/components'

const WelcomeWindow = ({
  isOpen,
  enterGame,
  setBackgroundId,
  setShowWelcomeWindow,
  setShowFactionSupportOverviewWindow
}) => {
  const initHeight = window.innerHeight * 0.9
  const initWidth = window.innerWidth * 0.8

  const audio = {
    soundtrack: new Audio('./assets/sounds/mixkit-game-level-music-689.wav'),
    click: new Audio(
      './assets/sounds/mixkit-quick-positive-video-game-notification-interface-265.wav'
    )
  }

  return (
    <WindowModal
      // place window in center of screen
      initTop={window.innerHeight / 2 - initHeight / 2}
      initLeft={window.innerWidth / 2 - initWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='ETH.DEV'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontSize: '12px',
          lineHeight: '25px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginTop: 20, marginBottom: 20, color: '#16DC8C' }}>
          Welcome to eth.dev!
        </h2>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          You are about to enter a game which aims to prepare you to navigate the Ethereum
          Blockchain space as a developer.
          <br />
          You will take the role of a tech-savvy cryptopunk that skirts the very edge of web3
          hacking.
        </p>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          Most of the coding challenges are taken from real-world examples. From apps and protocols
          that are live on the Ethereum main chain and in some cases handle hundreds of millions of
          $$$.
        </p>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          However, this is not a game for beginners!
          <br />
          This game is targeted towards more experienced developers that are proficient in
          JavaScript, NodeJS and the basics of Solidity.
        </p>
        <p style={{ lineHeight: '30px', color: '#16DC8C' }}>
          If you are looking to learn solidity basics, may we suggest that you head over to our
          friends at{' '}
          <a href='https://cryptozombies.io' target='_blank' rel='noreferrer'>
            cryptozombies.io
          </a>
          ?
        </p>
        <div style={{ float: 'left', width: '100%', padding: '0 20%' }}>
          <Button
            style={{ marginTop: 20 }}
            className='is-warning'
            onClick={() => {
              audio.click.play()
              setBackgroundId(backgroundIds.CityOutskirts)
              enterGame()
            }}
          >
            Start Journey
          </Button>
          <div
            style={{
              float: 'left',
              width: '100%',
              marginTop: 15,
              marginBottom: 15,
              textAlign: 'center'
            }}
          >
            or
          </div>
          <Button
            className='is-warning'
            onClick={() => {
              audio.click.play()
              enterGame(true)
              setBackgroundId(backgroundIds.CityOutskirts)
              setShowFactionSupportOverviewWindow(true)
            }}
          >
            Pick Level
          </Button>
        </div>
      </div>
    </WindowModal>
  )
}

export default WelcomeWindow
