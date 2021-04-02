import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import isMobile from 'is-mobile'
import { CodeContainer } from './views'
import { mapStateToProps, mapDispatchToProps, reducer } from './controller'

const styles = {
  button: {
    float: 'right',
    width: '80%',
    marginTop: '30px',
    marginLeft: '15%',
    marginRight: '10%'
  }
}

const DialogModal = ({ dialogVisible, dialogs, currentDialog, actions }) => {
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
            const { avatar, alignment, text, code, choices } = dialog

            const isLastVisibleDialog = index === currentDialog.index

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
                        minWidth: '120px',
                        imageRendering: 'pixelated',
                        transform: 'scaleX(1)'
                      }}
                    />
                  )}
                  <div
                    className={`nes-balloon from-${alignment}`}
                    style={{
                      width: 'calc(100% - 160px)',
                      lineHeight: '30px'
                    }}
                  >
                    <p>
                      {text}
                      {code && <CodeContainer language='bash' children={code} />}
                    </p>
                  </div>
                  {alignment === 'right' && (
                    <img
                      src={`./assets/${avatar}`}
                      alt='avatar'
                      style={{
                        minWidth: '120px',
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
