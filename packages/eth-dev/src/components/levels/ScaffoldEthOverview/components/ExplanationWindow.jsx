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
      initHeight={window.innerHeight * 0.6}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='scaffold-eth'
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
          overflowX: 'hidden'
        }}
      >
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            color: '#16DC8C',
            // color: '#C9D1D9',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          <>
            Many eth.dev challenges were built using{' '}
            <a href='https://github.com/scaffold-eth/scaffold-eth' target='_blank' rel='noreferrer'>
              scaffold-eth
            </a>{' '}
            as a boilerplate.
          </>
          {currentStep > 0 && (
            <>
              <br />
              <br />
              Scaffold-eth provides an off-the-shelf stack for rapid prototyping on Ethereum, giving
              developers access to state-of-the-art tools to quickly learn and ship an
              Ethereum-based DApp.
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />I was created and is still maintained by{' '}
              <a href='https://twitter.com/austingriffith' target='_blank' rel='noreferrer'>
                Austin Griffith
              </a>
              .
            </>
          )}
          {currentStep > 2 && (
            <>
              <br />
              <br />
              We suggest that you familiarize yourself with the high level structure and tools
              scaffold-eth uses before continuing with the game.
              <br />
              {'-> '}
              <a href='https://docs.scaffoldeth.io/scaffold-eth/' target='_blank' rel='noreferrer'>
                scaffold-eth docs
              </a>
            </>
          )}
        </div>
        {currentStep <= 2 && (
          <Button
            onClick={() => {
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep > 2 && (
          <Button
            className='is-warning'
            onClick={() => {
              globalGameActions.dialog.continueDialog()
              setExplanationWindowVisibility(false)
              setCurrentStep(currentStep + 1)
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
