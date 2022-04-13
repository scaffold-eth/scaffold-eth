import React, { useState } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const HistoryWindow = ({
  isOpen,
  setHistoryWindowVisibility,
  setContractWindowVisibility,
  setChallengeWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <WindowModal
      initTop={20}
      initLeft={window.innerWidth * 0.1}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='NFT History'
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
          Anon Punk needs a way to make sure that each member of his gang can be easily verified.
          We'll help him solve his problem by building a NFT contract, together with a react based
          NFT store front.
          {currentStep > 0 && (
            <>
              <br />
              <br />
              NFT's have been all the rage in 2021 and 2022, but they have been around for much
              longer. If you want, you can read up on the history of NFT's{' '}
              <a
                href='https://medium.com/@Andrew.Steinwold/the-history-of-non-fungible-tokens-nfts-f362ca57ae10'
                target='_blank'
                rel='noreferrer'
              >
                here
              </a>
              .
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />
              Most of the NFT's on Ethereum follow the{' '}
              <a href='http://erc721.org' target='_blank' rel='noreferrer'>
                ERC721 standard
              </a>{' '}
              which was first introduced and then continuously developed{' '}
              <a
                href='https://github.com/ethereum/EIPs/issues/721'
                target='_blank'
                rel='noreferrer'
              >
                here
              </a>
              .
            </>
          )}
          {currentStep > 2 && (
            <>
              <br />
              <br />
              NOTE: There are a lot of different styles when it comes to NFT contracts. You can take
              a look at some of them over at{' '}
              <a
                href='https://docs.openzeppelin.com/contracts/2.x/api/token/erc721'
                target='_blank'
                rel='noreferrer'
              >
                OpenZeppelin
              </a>
              .
            </>
          )}
        </div>

        {currentStep > 2 && (
          <Button
            onClick={() => {
              setContractWindowVisibility(true)
            }}
          >
            Show example NFT contract
          </Button>
        )}

        {currentStep < 3 && currentStep !== 3 && (
          <Button
            onClick={() => {
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep === 3 && (
          <Button
            className='is-warning'
            onClick={() => {
              setHistoryWindowVisibility(false)
              setChallengeWindowVisibility(true)
            }}
          >
            Start Challenge
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default HistoryWindow
