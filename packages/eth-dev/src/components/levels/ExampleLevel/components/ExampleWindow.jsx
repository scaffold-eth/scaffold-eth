import React, { useState } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExampleWindow = ({
  isOpen,
  continueDialog,
  setExampleWindowVisibility,
  setContractWindowVisibility,
  setGithubWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={20}
      initLeft={window.innerWidth * 0.3}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Example Pop Up Window'
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
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          Each time the user clicks continue it displays the next step in our ExampleWindow.jsx file.  
          {currentStep > 0 && (
            <>
              <br />
              <br />
              You can use regular HTML links within these pages like {' '}
              <a
                href='https://buidlguidl.com'
                target='_blank'
                rel='noreferrer'
              >
                this
              </a>
              .
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />
              Now we display step 3 along with 2 buttons.  The first will pop-up an example NFT contract found in our /components/ folder.  The second button will close this window and continue the dialog.
              
            </>
          )}
        </div>

        {currentStep > 1 && (
          <Button
            onClick={() => {
              setContractWindowVisibility(true)
            }}
          >
            Show example NFT contract
          </Button>
        )}

        {currentStep < 2 && currentStep !== 2 && (
          <Button
            onClick={() => {
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep === 2 && (
          <Button
            className='is-warning'
            onClick={() => {
              setContractWindowVisibility(false)
              setExampleWindowVisibility(false)
              continueDialog()
            }}
          >
            Continue Dialog
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default ExampleWindow
