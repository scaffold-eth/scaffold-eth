import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({
  isOpen,
  continueDialog,
  setExplanationWindowVisibility,
  setDaoContractWindowVisibility,
  setDarkDaoContractWindowVisibility,
  setFetchIntructionsWindowVisibility
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
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          Have you ever wondered why there are two Ethereums listed on most exchanges and token
          lists, Ethereum and Ethereum Classic?
          {currentStep > 0 && (
            <>
              <br />
              <br />
              Well, back in 2016 the German company slock.it created one of the first DAO contracts
              on Ethereum. The contract quickly gained in popularity, collecting almost 15% of the
              total ETH supply.
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />
              Then on 19th of June, Martin Koeppelman (CEO of Gnosis) submitted a post on
              r/ethereum: "
              <a
                target='_blank'
                rel='noreferrer'
                href='https://www.reddit.com/r/ethereum/comments/4oi2ta/i_think_thedao_is_getting_drained_right_now/'
              >
                I think TheDAO is getting drained right now
              </a>
              " alerting the community that a hack was happening.
              <br />
              <br />
              Read up on the full event{' '}
              <a
                target='_blank'
                rel='noreferrer'
                href='https://github.com/ethereumbook/ethereumbook/blob/develop/appdx-forks-history.asciidoc'
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
              Further reading:
              <br />
              <br />
              <ul>
                <li>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href='https://blog.ethereum.org/2016/06/17/critical-update-re-dao-vulnerability/'
                  >
                    Ethereum Foundation statement
                  </a>
                </li>
                <li>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href='https://www.reddit.com/r/ethereum/comments/4os7l5/the_big_thedao_heist_faq/'
                  >
                    Martin Koeppelman DAO FAQ
                  </a>
                </li>
                <li>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href='https://medium.com/@oaeee/the-rise-of-the-dark-dao-72b21a2212e3#.rnb1n01h8'
                  >
                    Overview of relevant transactions of the hack
                  </a>
                </li>
              </ul>
            </>
          )}
          {currentStep > 3 && <>Help Anon Punk hack the factions DAO.</>}
          {currentStep > 4 && (
            <>
              <br />
              Here is the contract we used to deploy their DAO.
            </>
          )}
          {currentStep > 5 && (
            <>
              <br />
              Additionally my people have collected the following resources for you. Focus on the
              contracts in /packages/hardhat/contracts/ .
            </>
          )}
        </div>
        {currentStep <= 5 && (
          <Button
            onClick={() => {
              if (currentStep === 3) {
                setDaoContractWindowVisibility(true)
                setFetchIntructionsWindowVisibility(true)
              }

              if (currentStep === 6) {
                setFetchIntructionsWindowVisibility(true)
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
              continueDialog()
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

export default ExplanationWindow
