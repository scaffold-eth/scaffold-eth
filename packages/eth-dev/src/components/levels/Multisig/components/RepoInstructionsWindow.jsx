import React from 'react'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { CodeContainer, WindowModal } from '../../../gameItems/components'

const RepoInstructionsWindow = ({ isOpen }) => {
  const initWidth = 800
  const initHeight = 450

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      // initLeft={window.innerWidth / 2}
      initLeft={0}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window_large.png'
      dragAreaHeightPercent={12}
      windowTitle='MultiSigWallet.sol'
      isOpen={isOpen}
      windowTiteleStyle={{ top: '2.5%', left: '56%' }}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <CodeContainer language='bash'>
          {`# fetch code
$ git clone https://github.com/ssteiger/eth-dev-challenges.git

$ cd eth-dev-challenges

$ git checkout multi-sig

# install dependencies
$ yarn

# deploy contracts
$ yarn deploy

# start app - when asked to use a different port, hit yes
$ yarn start`}
        </CodeContainer>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(RepoInstructionsWindow)
