import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../components'

const MiniLectureWindow = ({ isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='memory vs. calldata'
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
        <div
          style={{
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          <a
            href='https://medium.com/upstate-interactive/solidity-override-vs-virtual-functions-c0a5dfb83aaf'
            target='_blank'
            rel='noreferrer'
          >
            https://medium.com/upstate-interactive/solidity-override-vs-virtual-functions-c0a5dfb83aaf
          </a>
          <Button
            className='is-warning'
            onClick={() => {
              console.log('done')
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </WindowModal>
  )
}

export default MiniLectureWindow
