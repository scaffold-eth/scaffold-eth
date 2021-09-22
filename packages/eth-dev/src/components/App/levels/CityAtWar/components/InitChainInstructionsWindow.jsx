import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { CodeContainer, WindowModal } from '../../../gameItems/components'

const InitChainInstructionsWindow = ({ dialog, actions, isOpen }) => {
  return (
    <WindowModal
      initTop={60}
      initLeft={400}
      initHeight={300}
      initWidth={730}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '5%', paddingLeft: 20, paddingRight: 20 }}
    >
      <CodeContainer language='bash'>
        {`# clone the eth-dev branch
$ git clone -b eth-dev https://github.com/austintgriffith/scaffold-eth.git eth-dev
$ cd eth-dev

# start a local ethereum blockchain
$ yarn chain

# in second terminal:
# deploys some smart contracts that will be used throughout the game
$ yarn deploy`}
      </CodeContainer>
    </WindowModal>
  )
}

export default wrapGlobalGameData(InitChainInstructionsWindow)
