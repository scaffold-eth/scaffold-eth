import React from 'react'
import Typist from 'react-typist'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { CodeContainer, WindowModal } from '../../../gameItems/components'

const InitChainInstructionsWindow = ({ dialog, actions, isOpen }) => {
  return (
    <WindowModal
      initTop={60}
      initLeft={400}
      initHeight={460}
      initWidth={830}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '5%', paddingLeft: 20, paddingRight: 20 }}
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
    </WindowModal>
  )
}

export default wrapGlobalGameData(InitChainInstructionsWindow)
