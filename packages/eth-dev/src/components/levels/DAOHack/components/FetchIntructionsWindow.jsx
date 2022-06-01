import React from 'react'
import { CodeContainer, WindowModal } from '../../../gameItems/components'

const FetchIntructionsWindow = ({ isOpen }) => {
  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth / 2 - window.innerWidth * 0.05}
      initHeight={600}
      initWidth={750}
      backgroundPath='./assets/items/window_large.png'
      dragAreaHeightPercent={6}
      windowTitle='Resources'
      isOpen={isOpen}
      windowTiteleStyle={{ top: '3.5%', left: '56%' }}
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

$ git checkout dao-hack

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

export default FetchIntructionsWindow
