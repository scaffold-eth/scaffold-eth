import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({ isOpen, globalGameActions, setExplanationWindowVisibility }) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Bonding Curves'
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
          backgroundColor: '#161B22'
        }}
      >
        <h1>Bonding Curves</h1>
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            // color: '#16DC8C',
            color: '#C9D1D9',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: '16px'
          }}
        >
          The following repository branch will show you how you can get started integrating/using
          Bonding Curves which makes use of Bancor's Bonding Curve formula.
          <br />
          <CodeContainer language='bash'>
            {`# fetch code
$ git clone -b bonding-curve https://github.com/austintgriffith/scaffold-eth.git bonding-curve
$ cd bonding-curve
# switch branch
$ git checkout bonding-curve

# install dependencies
$ yarn

# start a local ethereum network
# $ yarn chain

# in second terminal:
# deploy contracts
$ yarn deploy`}
          </CodeContainer>
        </div>

        {currentStep === 0 && (
          <Button
            onClick={() => {
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}

        {currentStep > 0 && (
          <Button
            className='is-warning'
            onClick={() => {
              globalGameActions.dialog.continueDialog()
              setExplanationWindowVisibility(false)
            }}
          >
            Done
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(ExplanationWindow)
