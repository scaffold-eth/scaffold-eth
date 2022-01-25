import React from 'react'
import Typist from 'react-typist'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const InstructionsWindow = ({
  isOpen,
  dialog,
  globalGameActions,
  setInstructionsWindowVisibility
}) => {
  const initWidth = window.innerWidth / 2
  const initHeight = window.innerHeight * 0.95

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={12}
      windowTitle='CONNECTION INSTRUCTIONS'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}
      >
        <div style={{ marginTop: '1%', marginBottom: '5%', color: '#16DC8C' }}>
          Setting up Metamask and connecting to your local Etherem Network.
          <br />
          <br />
        </div>
        <CodeContainer language='bash'>
          {`# Follow the instructions in this video:

# youtube.com/watch?v=FTDEX3S1eqU#t=3m11s

# start at 3.11`}
        </CodeContainer>
        <Button
          className='is-warning'
          onClick={() => {
            globalGameActions.dialog.continueDialog()
            setInstructionsWindowVisibility(false)
          }}
        >
          Done
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(InstructionsWindow)
