import React, { useEffect } from 'react'
import $ from 'jquery'
import { useContractLoader, useContractReader } from '../../../../../../../hooks'
import { WindowModal } from '../../../../../../../sharedComponents'

const styles = {
  button: {
    float: 'left',
    width: '96%',
    marginTop: '30px',
    marginLeft: '2%',
    marginRight: '5%',
    fontSize: '12px'
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
    <WindowModal
      initWidth={600}
      initHeight={600}
      initTop={100}
      initLeft={30}
      title='Communication'
      isOpen
    >
      {dialogVisible && (
        <div
          id='speechContainer'
          style={{
            height: 600 - 30,
            overflowY: 'scroll',
            marginTop: 32,
            padding: 15,
            background: 'rgb(166, 207, 247, 0.5)'
            // backgroundColor: '#0A2227'
          }}
        >
          {dialogs[currentDialog.name].map((dialog, index) => {
            const { anchorId, avatar, alignment, text, code, choices } = dialog

            const isLastVisibleDialog = index === currentDialog.index
            const isFinalDialog = index === dialogs[currentDialog.name].length - 1

            if (index <= currentDialog.index && !currentDialog.skip) {
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

                  {!isFinalDialog && isLastVisibleDialog && !choices && (
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
                        scrollToBottom('#speechContainer')
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
      )}
    </WindowModal>
  )
}

export default DialogWindow
