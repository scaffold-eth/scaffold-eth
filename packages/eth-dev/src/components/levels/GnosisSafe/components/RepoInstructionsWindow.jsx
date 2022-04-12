import React from 'react'
import { CodeContainer, WindowModal } from '../../../gameItems/components'

const RepoInstructionsWindow = ({ isOpen }) => {
  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth / 2}
      initHeight={600}
      initWidth={750}
      backgroundPath='./assets/items/window_large.png'
      dragAreaHeightPercent={12}
      windowTitle='Project Files'
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
          {`# fetch files
$ git clone https://github.com/gnosis/safe-contracts
$ cd safe-contracts

# open files in your favorite editor`}
        </CodeContainer>
      </div>
    </WindowModal>
  )
}

export default RepoInstructionsWindow
