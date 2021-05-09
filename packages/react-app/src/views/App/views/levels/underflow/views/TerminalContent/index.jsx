import React from 'react'
import $ from 'jquery'
import { connectController } from './controller'
import { useContractLoader, useContractReader } from '../../../../../../../hooks'

const styles = {
  button: {
    float: 'left',
    width: '96%',
    marginTop: '30px',
    marginLeft: '2%',
    marginRight: '5%',
    fontSize: '8px'
  }
}

const TerminalContent = ({
  localProvider,
  userAddress,
  dialogs: { currentDialog, currentDialogIndex },
  actions
}) => {
  const scrollToBottom = _elementSelector => {
    let elementSelector = `#dialogContainer .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:

  const userERC20Balance = useContractReader(
    readContracts,
    'EthereumCityERC20TokenMinter',
    'balances',
    [userAddress]
  )
  console.log('🤗 userERC20Balance:', userERC20Balance && userERC20Balance.toString())
  /*
  const userBalance = useContractReader(readContracts, 'EthereumCityERC20TokenMinter', 'clicks', [
    address
  ])
  */

  const userFoundContractTrick =
    parseInt(userERC20Balance, 10) >
    115792089237316195423570985008687907853269984665640564039457584007913129639

  if (userFoundContractTrick) {
    console.log('user found the trick -> set dialog to xxx')
  } else {
    console.log('user did not find trick yet')
  }

  return (
    <>
      {currentDialog.map((dialogStep, index) => {
        const { anchorId, avatar, alignment, text, code, choices } = dialogStep

        const isLastVisibleDialog = index === currentDialogIndex
        const isFinalDialog = index === currentDialog.length - 1

        if (index <= currentDialogIndex) {
          return (
            <div
              style={{
                float: alignment,
                width: '100%',
                marginTop: '15px'
              }}
            >
              {alignment === 'left' && (
                <img
                  src={`./assets/${avatar}`}
                  alt='avatar'
                  className='background-image'
                  style={{
                    minWidth: '40px',
                    transform: 'scaleX(1)'
                  }}
                />
              )}
              <div
                className={`nes-balloon from-${alignment}`}
                style={{
                  width: 'calc(100% - 60px)',
                  padding: '6px',
                  fontSize: '8px',
                  lineHeight: '15px'
                }}
              >
                <p>{text}</p>
              </div>
              {alignment === 'right' && (
                <img
                  src={`./assets/${avatar}`}
                  alt='avatar'
                  className='background-image'
                  style={{
                    minWidth: '40px',
                    transform: 'scaleX(-1)'
                  }}
                />
              )}

              {isLastVisibleDialog &&
                choices &&
                choices.length &&
                choices.map(choice => {
                  return (
                    <button
                      type='button'
                      className='nes-btn is-warning'
                      id={choice.id}
                      onClick={() => {
                        console.log('clicked choice button')
                        console.log({ goToDialog: choice.goToDialog })
                        if (choice.goToDialog) {
                          // TODO: implement this
                          console.log('now going to dialog: ' + choice.goToDialog)
                          actions.setCurrentDialog({ name: choice.goToDialog })
                        } else {
                          actions.continueDialog()
                        }
                        scrollToBottom()
                      }}
                      style={{ ...styles.button }}
                    >
                      {choice.buttonText}
                    </button>
                  )
                })}

              {!isFinalDialog && isLastVisibleDialog && !choices && (
                <button
                  type='button'
                  className='nes-btn'
                  id='continue'
                  onClick={() => {
                    actions.continueDialog()
                    scrollToBottom()
                  }}
                  style={{ ...styles.button }}
                >
                  Continue
                </button>
              )}
              {isFinalDialog && userFoundContractTrick && (
                <button
                  type='button'
                  className='nes-btn'
                  id='continue'
                  onClick={() => {
                    actions.startCityLevel()
                    scrollToBottom()
                  }}
                  style={{ ...styles.button }}
                >
                  Continue
                </button>
              )}
            </div>
          )
        }
      })}
    </>
  )
}

export default connectController(TerminalContent)
