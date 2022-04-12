import React, { useState } from 'react'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({
  isOpen,
  continueDialog,
  setContractWindowVisibility,
  setExplanationWindowVisibility
}) => {
  const initWidth = window.innerWidth / 2
  const initHeight = window.innerHeight * 0.95

  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth * 0.1}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Gambling Contracts'
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
          Creating provably fair and secure gambling contracts is quite the challenge.
          {currentStep > 0 && (
            <>
              <br />
              See if you can find a way to dupe the contract and win 10 times in a row.
            </>
          )}
          <br />A boilerplate has been prepared for you that you can fetch here:
          <div style={{ marginTop: 25 }}>
            You can read about "The Ins & Outs of Smart Contract Gambling"{' '}
            <a
              href='https://eth.casino/ethereum-guides/ins-outs-smart-contract-gambling/'
              target='_blank'
              rel='noreferrer'
            >
              here
            </a>
            .
          </div>
        </div>
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            setContractWindowVisibility(false)
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
