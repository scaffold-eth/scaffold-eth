
import React, { useState } from 'react'
import { useLocalStorage } from 'react-use'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'
import { LEVEL_ID } from '..'

const ExampleTerminal = ({
  isOpen,
  continueDialog,
  setExampleWindowVisibility,
  setContractWindowVisibility,
  setExampleTerminalVisibility
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      //initTop={20}
      initLeft={window.innerWidth * 0.3} 
      initTop={window.innerHeight * 0.3}
      initHeight={ 344 }
      initWidth={ 380 }
      backgroundPath='./assets/items/terminal_small.png'
      dragAreaHeightPercent={35}
      //windowTitle='Small Terminal'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: '7%', paddingLeft: '10%', paddingRight: '20%', paddingBottom: '7%' }}
      
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
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16,
          }}
        >
          HTML code can be used here
          <br />
          <br />
          <br />
          <br />
          <br />
          <Button
            className='is-warning'
            onClick={() => {
              //setExampleWindowVisibility(false)
              setExampleTerminalVisibility(false)
              continueDialog()
            }}
            
          >
            Continue Dialog
          </Button>
        </div>
      </div>
    </WindowModal>
  )
}

export default ExampleTerminal
