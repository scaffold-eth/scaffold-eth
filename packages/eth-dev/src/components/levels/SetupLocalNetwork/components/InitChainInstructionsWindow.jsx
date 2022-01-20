import React from 'react'
import Typist from 'react-typist'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { CodeContainer, WindowModal } from '../../../gameItems/components'

const InitChainInstructionsWindow = ({ dialog, actions, isOpen }) => {
  const initWidth = window.innerWidth / 2
  const initHeight = initWidth

  return (
    <WindowModal
      // place window in center of screen
      initTop={0}
      initLeft={0}
      initHeight={700}
      initWidth={525}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={12}
      isOpen
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
        SETUP INSTRUCTIONS
      </div>
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '85%',
          marginTop: '2%',
          marginBottom: initHeight * 0.05,
          overflowY: 'scroll',
          color: '#fff'
        }}
      >
        <CodeContainer language='bash'>
          {`# follow these steps to setup a local etherem network

# clone the eth-dev branch
$ git clone -b eth-dev https://github.com/austintgriffith/scaffold-eth.git eth-dev
$ cd eth-dev

# install dependencies
$ yarn

# start a local ethereum network
$ yarn chain

# in second terminal:
# deploys some smart contracts that we'll use throughout the game
$ yarn deploy`}
        </CodeContainer>

        <div
          style={{
            padding: '10px 50px',
            color: '#16DC8C'
          }}
        >
          <Typist cursor={{ show: false }} avgTypingDelay={50} loop>
            Scanning for local network ...
          </Typist>
        </div>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(InitChainInstructionsWindow)
