import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import isMobile from 'is-mobile'
import { Button, Typography } from 'antd'
import { useContractLoader, useContractReader, useEventListener } from '../../../../hooks'
import { CodeContainer } from './views'
import { mapStateToProps, mapDispatchToProps, reducer } from './controller'

const { Title } = Typography

const styles = {
  button: {
    float: 'right',
    width: '80%',
    marginTop: '30px',
    marginLeft: '15%',
    marginRight: '10%',
    fontSize: '12px'
  }
}

const DialogModal = ({
  localProvider,
  userProvider,
  transactor,
  address,
  dialogVisible,
  dialogs,
  currentDialog,
  actions
}) => {
  const scrollToBottom = element => {
    const { scrollHeight } = $(element)[0]
    $(element).animate({ scrollTop: scrollHeight }, 'slow')
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
  const writeContracts = useContractLoader(userProvider)

  // keep track of a variable from the contract in the local React state:
  const userClicks = useContractReader(readContracts, 'Clicker', 'clicks', [address])
  console.log('🤗 userClicks:', userClicks)

  // 📟 Listen for broadcast events
  const clickEvents = useEventListener(readContracts, 'Clicker', 'Click', localProvider, 1)
  console.log('📟 clickEvents:', clickEvents)

  const userFoundContractTrick =
    userClicks > 115792089237316195423570985008687907853269984665640564039457584007913129639

  if (userFoundContractTrick) {
    console.log('user found the trick -> set dialog to xxx')
  } else {
    console.log('user did not find trick yet')
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '94px',
        left: isMobile() ? '5%' : '20%',
        right: isMobile() ? '5%' : '20%',
        height: '73vh',
        zIndex: 100
      }}
    >
      {dialogVisible && (
        <div
          id='speechContainer'
          style={{
            height: '73vh',
            overflowY: 'scroll',
            padding: '15px'
          }}
        >
          {dialogs[currentDialog.name].map((dialog, index) => {
            const { anchorId, avatar, alignment, text, code, choices } = dialog

            const isLastVisibleDialog = index === currentDialog.index
            const isFinalDialog = index === dialogs[currentDialog.name].length - 1

            if (index <= currentDialog.index) {
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
                      style={{
                        minWidth: '90px',
                        imageRendering: 'pixelated',
                        transform: 'scaleX(1)'
                      }}
                    />
                  )}
                  <div
                    className={`nes-balloon from-${alignment}`}
                    style={{
                      width: 'calc(100% - 160px)',
                      padding: '12px',
                      fontSize: '12px',
                      lineHeight: '27px'
                    }}
                  >
                    <p>{text}</p>
                    {code && <CodeContainer language='bash' children={code} />}
                    {currentDialog.name === 'setupCodingEnv' && anchorId === 'cityFundsContract' && (
                      <div style={{ padding: '20px', border: '1px solid #ccc' }}>
                        <div style={{ textAlign: 'center' }}>
                          <Title level={3}>{userClicks && userClicks.toString()}</Title>
                        </div>

                        <Button
                          block
                          onClick={() => {
                            transactor(writeContracts.Clicker.increment())
                          }}
                          style={{ marginBottom: '15px' }}
                        >
                          increment
                        </Button>
                        <Button
                          block
                          onClick={() => {
                            transactor(writeContracts.Clicker.decrement())
                          }}
                        >
                          decrement
                        </Button>
                      </div>
                    )}
                  </div>
                  {alignment === 'right' && (
                    <img
                      src={`./assets/${avatar}`}
                      alt='avatar'
                      style={{
                        minWidth: '90px',
                        imageRendering: 'pixelated',
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
                            scrollToBottom('#speechContainer')
                          }}
                          style={{ ...styles.button }}
                        >
                          {choice.buttonText}
                        </button>
                      )
                    })}
                  {isLastVisibleDialog && !choices && (
                    <button
                      type='button'
                      className='nes-btn'
                      id='continue'
                      onClick={() => {
                        actions.continueCurrentDialog()
                        scrollToBottom('#speechContainer')
                      }}
                      style={{ ...styles.button }}
                    >
                      Continue ...
                    </button>
                  )}
                  {isFinalDialog && userFoundContractTrick && (
                    <button
                      type='button'
                      className='nes-btn is-warning'
                      id='continue'
                      onClick={() => {
                        // actions.continueCurrentDialog()
                        scrollToBottom('#speechContainer')
                      }}
                      style={{ ...styles.button }}
                    >
                      Transfer funds to wallet
                    </button>
                  )}
                </div>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogModal)

export { reducer }
