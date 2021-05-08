import React from 'react'
import $ from 'jquery'
import dialog from '../../model/dialog'
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

const TerminalContent = ({ localProvider, address, currentDialogIndex, actions }) => {
  const scrollToBottom = _elementSelector => {
    let elementSelector = `#dialogContainer .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:

  const userBalance = useContractReader(readContracts, 'EthereumCityERC20TokenMinter', 'balances', [
    address
  ])
  console.log('🤗 userBalance:', userBalance && userBalance.toString())
  /*
  const userBalance = useContractReader(readContracts, 'EthereumCityERC20TokenMinter', 'clicks', [
    address
  ])
  */

  const userFoundContractTrick =
    parseInt(userBalance, 10) >
    115792089237316195423570985008687907853269984665640564039457584007913129639

  if (userFoundContractTrick) {
    console.log('user found the trick -> set dialog to xxx')
  } else {
    console.log('user did not find trick yet')
  }

  return (
    <>
      {dialog.map((dialogStep, index) => {
        const { anchorId, avatar, alignment, text, code, choices } = dialogStep
        const isLastVisibleDialog = index === currentDialogIndex
        const isFinalDialog = index === dialog.length - 1

        if (index <= currentDialogIndex) {
          return (
            <div
              style={{
                float: alignment,
                width: '100%',
                margin: '15px 0'
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
                        if (choice.goToDialog) {
                          console.log('now going to dialog: ' + choice.goToDialog)
                          actions.setCurrentDialog({ name: choice.goToDialog })
                        } else {
                          actions.continueCurrentDialog()
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
                    actions.continueCurrentDialog()
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
                    // actions.continueCurrentDialog()
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
