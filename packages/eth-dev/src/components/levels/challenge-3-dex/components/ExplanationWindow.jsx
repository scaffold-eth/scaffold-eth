import React from 'react'
import { useLocalStorage } from 'react-use'
import { Button, MarkdownContainer, WindowModal } from '../../../gameItems/components'

import { LEVEL_ID } from '..'

const ExplanationWindow = ({
  isOpen,
  setContractWindowVisibility,
  setExplanationWindowVisibility,
  setEtherDeltaWindowVisibility,
  setChallengeWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useLocalStorage(`${LEVEL_ID}-currentStep`, 1)

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth * 0.02}
      initHeight={window.innerHeight * 0.96}
      initWidth={window.innerWidth / 2}
      backgroundPath='./assets/items/window_large.png'
      dragAreaHeightPercent={6}
      windowTitle='DEX'
      isOpen={isOpen}
      windowTiteleStyle={{ top: '3.5%', left: '56%' }}
      // contentContainerStyle={{ paddingTop: 0 }}
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
        <h2>Decentralized Exchanges</h2>
        <div
          style={{
            marginTop: '5%',
            marginBottom: '5%',
            color: '#16DC8C',
            // color: '#C9D1D9',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          {/* <Markdown>{fileContent}</Markdown> */}
          Ethereum has a long and rich history when it comes to decentralized exchanges.
          {currentStep > 0 && (
            <>
              <br />
              <br />A decentralized exchange is a bundle of smart contracts where users can freely
              trady tokens with each other. Just like they would on centralized exchanges like
              Coinbase or Binance.
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />
              One of the first DEX's that got some notable traction within the community was an
              exchange known as{' '}
              <a href='https://etherdelta.com' target='_blank' rel='noreferrer'>
                EtherDelta
              </a>
              .
            </>
          )}
          {currentStep > 2 && (
            <>
              <br />
              The original code and the smart contracts used to run this DEX can be found{' '}
              <a
                href='https://github.com/etherdelta/smart_contract/blob/master/etherdelta.sol'
                target='_blank'
                rel='noreferrer'
              >
                here
              </a>
              .
              <br />
              <br />
            </>
          )}
          {currentStep > 3 && (
            <>
              Some time in early 2017 Vitalik Buterin{' '}
              <a
                href='https://www.reddit.com/r/ethereum/comments/55m04x/lets_run_onchain_decentralized_exchanges_the_way/'
                target='_blank'
                rel='noreferrer'
              >
                proposed
              </a>{' '}
              a way to run a decentralized exchange on Ethereum. He later{' '}
              <a
                href='https://ethresear.ch/t/improving-front-running-resistance-of-x-y-k-market-makers/1281'
                target='_blank'
                rel='noreferrer'
              >
                expanded
              </a>{' '}
              on the original idea by introducing the now famouse x*y=k formula.
              <br />
              <br />
            </>
          )}
          {currentStep > 4 && (
            <>
              One of the people that stumbled accrosse Buterins post was{' '}
              <a href='https://twitter.com/haydenzadams' target='_blank' rel='noreferrer'>
                Hayden Adams
              </a>
              , founder of Uniswap. He promptly coded up a{' '}
              <a
                href='https://github.com/Uniswap/old-solidity-contracts'
                target='_blank'
                rel='noreferrer'
              >
                MVP
              </a>{' '}
              which eventually grew into what{' '}
              <a href='https://app.uniswap.org' target='_blank' rel='noreferrer'>
                Uniswap
              </a>{' '}
              is today.
              <br />
              <br />
            </>
          )}
          {currentStep > 5 && (
            <>
              Use{' '}
              <a
                href='https://docs.scaffoldeth.io/scaffold-eth/challenges/minimum-viable-dex'
                target='_blank'
                rel='noreferrer'
              >
                these
              </a>{' '}
              resources to help Anon Punk build the DEX.
              <br />
              <br />
              {/*
                This repo is an updated version of the{' '}
                <a
                href='https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90'
                target='_blank'
                rel='noreferrer'
              >
                original
              </a>{' '}
               */}
              There is also a{' '}
              <a
                href='https://www.youtube.com/watch?v=eP5w6Ger1EQ&t=364s&ab_channel=SimplyExplained'
                target='_blank'
                rel='noreferrer'
              >
                Youtube
              </a>{' '}
              that may help you understand the concepts covered within this challenge.
            </>
          )}
        </div>
        {currentStep <= 5 && (
          <Button
            onClick={() => {
              if (currentStep === 1) {
                setEtherDeltaWindowVisibility(true)
              }
              if (currentStep > 2) {
                setEtherDeltaWindowVisibility(false)
              }
              if (currentStep === 5) {
                setContractWindowVisibility(true)
              }
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep > 5 && (
          <Button
            className='is-warning'
            onClick={() => {
              setContractWindowVisibility(false)
              setExplanationWindowVisibility(false)
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

export default ExplanationWindow
