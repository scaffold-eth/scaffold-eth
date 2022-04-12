import React, { useState } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({ isOpen, continueDialog, setExplanationWindowVisibility }) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Upgradable Contracts'
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
        <h1>Upgradable Contracts</h1>
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
          To learn more about upgradable contracts start with this excellent{' '}
          <a
            href='https://betterprogramming.pub/not-all-smart-contracts-are-immutable-create-upgradable-smart-contracts-e4e933b7b8a9'
            target='_blank'
            rel='noreferrer'
          >
            introduction
          </a>{' '}
          on the topic.
          <br />
          Then take a look at{' '}
          <a
            href='https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable'
            target='_blank'
            rel='noreferrer'
          >
            OpenZeppelin docs
          </a>{' '}
          on using their upgradable contract framework or whatch their introduction video{' '}
          <a href='https://www.youtube.com/watch?v=JgSj7IiE4jA' target='_blank' rel='noreferrer'>
            here
          </a>
          .
        </div>
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            setExplanationWindowVisibility(false)
          }}
        >
          Done
        </Button>
      </div>
    </WindowModal>
  )
}

export default ExplanationWindow
