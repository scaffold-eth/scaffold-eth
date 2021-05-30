import React from 'react'
import $ from 'jquery'
import { useUserAddress } from 'eth-hooks'
import { connectController } from './controller'
import {
  usePoller,
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader
} from '../../../../../../../hooks'
import { getLocalProvider, getTargetNetwork, Transactor } from '../../../../../../../helpers'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

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
  dialogs: { currentDialog, currentDialogIndex, selectedDialogParts },
  actions
}) => {
  const injectedProvider = null // TODO:
  const userProvider = useUserProvider(injectedProvider, localProvider)

  const readContracts = useContractLoader(localProvider)

  const userAddress = useUserAddress(userProvider)

  // TODO:
  const userCompletedLevel = false

  // TODO: we only call scrollToBottom() when dialogs.currentDialogIndex changes
  //       but the last dialog step is hardcoded into this component (shown on userCompletedLevel)
  //       -> find a neater way to do this
  if (userCompletedLevel) {
    const scrollToBottom = _elementSelector => {
      let elementSelector = `#terminalDialogContainer .flexible-modal .content`
      if (_elementSelector) elementSelector = _elementSelector
      const { scrollHeight } = $(elementSelector)[0]
      $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
    }

    scrollToBottom()
  }

  return (
    <>
      {currentDialog.map((dialogStep, index) => {
        const { visibleToUser, dialogPartId, avatar, alignment, text, choices } = dialogStep

        const isLastVisibleDialog = index === currentDialogIndex
        const isFinalDialog = index === currentDialog.length - 1

        if (
          index <= currentDialogIndex &&
          visibleToUser &&
          selectedDialogParts.includes(dialogPartId)
        ) {
          return (
            <div
              className='test-mest'
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
                        console.log({ jumpToDialogPartId: choice.jumpToDialogPartId })
                        if (choice.jumpToDialogPartId) {
                          actions.jumpToDialogPart({ dialogPartId: choice.jumpToDialogPartId })
                        } else if (choice.goToDialog) {
                          actions.setCurrentDialog({ name: choice.goToDialog })
                        } else {
                          actions.continueDialog()
                        }
                      }}
                      style={{ ...styles.button }}
                    >
                      {choice.buttonText}
                    </button>
                  )
                })}

              {!isFinalDialog && isLastVisibleDialog && !choices && !userCompletedLevel && (
                <button
                  type='button'
                  className='nes-btn'
                  id='continue'
                  onClick={() => {
                    actions.continueDialog()
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

      {userCompletedLevel && (
        <>
          <img
            src='./assets/punk5950.png'
            alt='avatar'
            className='background-image'
            style={{
              minWidth: '40px',
              transform: 'scaleX(1)'
            }}
          />
          <div
            className='nes-balloon from-left'
            style={{
              width: 'calc(100% - 60px)',
              padding: '6px',
              fontSize: '8px',
              lineHeight: '15px'
            }}
          >
            <p>Jackpot! I'm sure these coins will be usefull ...</p>
          </div>
        </>
      )}

      {userCompletedLevel && (
        <button
          type='button'
          className='nes-btn is-warning'
          id='continue'
          onClick={() => {
            actions.startCityLevel()
            actions.setCityLevelBackground() // TODO: move this into city level component
            actions.setCityLevelDialog()
          }}
          style={{ ...styles.button }}
        >
          Drive into city
        </button>
      )}
    </>
  )
}

export default connectController(TerminalContent)
