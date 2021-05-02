import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import shortid from 'shortid'
import $ from 'jquery'
import { useContractLoader, useContractReader } from '../../../../../../../hooks'
import './styles.css'

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

const DialogWindow = ({
  localProvider,
  address,
  dialogVisible,
  dialogs,
  currentDialog,
  actions
}) => {
  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  const scrollToBottom = _elementSelector => {
    let elementSelector = `#dialog .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  useEffect(() => {
    $('#check-for-sites').click(() => {
      console.log('click and show user interface now')
      actions.setToolbeltVisibility({ visible: true })
    })
  }, [currentDialog, actions])

  console.log({ dialogs })
  console.log({ currentDialog })

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
    <span id='dialog'>
      <ReactModal
        className={uniqueWindowId}
        initWidth={359}
        initHeight={709}
        isOpen
        top={100}
        left={30}
      >
        {dialogVisible && (
          <>
            <div
              className='background-image'
              style={{
                height: '100%',
                overflowY: 'scroll',
                background: 'url(./assets/trimmed/terminal_trimmed.png)',
                backgroundSize: '100% 100%'
              }}
            />
            <div
              className='content'
              style={{
                position: 'absolute',
                top: '33%',
                right: 0,
                height: '62%',
                marginLeft: '10%',
                marginRight: '20%',
                overflow: 'scroll'
              }}
            >
              {dialogs[currentDialog.name].map((dialog, index) => {
                const { anchorId, avatar, alignment, text, code, choices } = dialog

                const isLastVisibleDialog = index === currentDialog.index
                const isFinalDialog = index === dialogs[currentDialog.name].length - 1

                if (index <= currentDialog.index && !dialog.skip) {
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
            </div>
          </>
        )}
      </ReactModal>
    </span>
  )
}

export default DialogWindow
