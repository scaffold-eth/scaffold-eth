import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({
  isOpen,
  globalGameActions,
  setExplanationWindowVisibility,
  setDaoContractWindowVisibility,
  setDarkDaoContractWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Some Ethereum History'
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
            marginTop: '1%',
            marginBottom: '5%',
            // color: '#16DC8C',
            color: '#C9D1D9',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: '16px'
          }}
        >
          Have you ever wondered why there are two Ethereums listed on most exchanges and token
          lists, Ethereum and Ethereum Classic?
          <br />
          Well, back in 2016 ... TODO
          <CodeContainer language='bash'>
            {`# fetch code
$ git clone -b eth-dev https://github.com/ssteiger/eth-dev-challenges
$ cd eth-dev-challenges
# switch branch
$ git checkout dao-hack

# install dependencies
$ yarn

# start a local ethereum network
# $ yarn chain

# in second terminal:
# deploy DAO
$ yarn deploy`}
          </CodeContainer>
        </div>
        <Button
          onClick={() => {
            setDaoContractWindowVisibility(true)
          }}
        >
          Continue
        </Button>
        {currentStep > 5 && (
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
