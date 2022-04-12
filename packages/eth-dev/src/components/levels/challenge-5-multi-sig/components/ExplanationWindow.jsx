import React, { useState } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({ isOpen, continueDialog, setContractWindowVisibility }) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Multi Sigs'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 10 }}
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
        <h3>Multi Signature Wallets</h3>
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          The problem that you and Anon punk are facing is a common one in the Blockchain space.
          {currentStep > 0 && (
            <>
              <br />
              How to securely handle large amounts of funds when collaborators/members are
              anonymous?
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />
              What most projects end up doing is using something called a Challenge5MultiSig.
              <br />A Challenge5MultiSig is a Smart Contract that can hold Ether and other tokens.
              And in addition can execute arbitrary smart contract functions (e.g. functions of
              other smart contracts like Uniswap, Opensea, Curve.fi, etc.).
            </>
          )}
          {currentStep > 2 && (
            <>
              <br />
              <br />
              Typically, the Challenge5MultiSig Contract incorporates some form of voting, where
              members of the Challenge5MultiSig vote by proposing what functions to execute and then
              collectively vote yay or nay on whether the function should be executed.
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
              continueDialog()
              setCurrentStep(currentStep + 1)
              setContractWindowVisibility(false)
            }}
          >
            Done
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default ExplanationWindow
