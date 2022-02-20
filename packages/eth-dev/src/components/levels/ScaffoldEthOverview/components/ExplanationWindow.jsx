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
      windowTitle='Introduction to scaffold-eth'
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
        <h1>Scaffold-eth</h1>
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
          Many eth.dev challenges use scaffold-eth as a boilerplate.
          <br />
          Scaffold-eth provides an off-the-shelf stack for rapid prototyping on Ethereum, giving
          developers access to state-of-the-art tools to quickly learn and ship an Ethereum-based
          DAPP.
          <br />
          <br />
          We suggest that you familiarize yourself with the high level structure and tool
          scaffold-eth uses before continuing with the game.
          <br />
          {'-> '}
          <a href='https://docs.scaffoldeth.io/scaffold-eth/' target='_blank' rel='noreferrer'>
            scaffold-eth docs
          </a>
        </div>

        <Button
          className='is-warning'
          onClick={() => {
            globalGameActions.dialog.continueDialog()
            setExplanationWindowVisibility(false)
          }}
        >
          Done
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(ExplanationWindow)
