import React, { useEffect } from 'react'
import $ from 'jquery'
import { Button } from '.'

const MonologDialogContainer = ({
  dialogPathsVisibleToUser,
  currentDialogIndex,
  setCurrentDialogIndex,
  continueDialog,
  jumpToDialogPath,
  levelDialog,
  ...parentProps
}) => {
  const scrollToBottom = _elementSelector => {
    let elementSelector = `#monologDialogContainer .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentDialogIndex])

  return (
    <div
      id='monologDialogContainer'
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-end',
        marginTop: 0,
        paddingLeft: '2%',
        paddingRight: '2%'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          placeContent: 'flex-end',
          overflow: 'auto',
          // for firefox
          minHeight: 0
        }}
      >
        <div
          className='content'
          style={{
            float: 'left',
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {levelDialog.map(
            ({ dialogPathId, dialog: dialogComponent, choices: choicesComponent }, index) => {
              const isVisible = dialogPathsVisibleToUser.includes(dialogPathId)
              const isLastVisibleDialog = index === currentDialogIndex

              if (isVisible && currentDialogIndex >= index) {
                return (
                  <>
                    {dialogComponent({
                      levelDialog,
                      isLastVisibleDialog,
                      setCurrentDialogIndex,
                      continueDialog,
                      jumpToDialogPath,
                      ...parentProps
                    })}
                  </>
                )
              }
            }
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
          paddingTop: 0
        }}
      >
        {levelDialog.map(
          ({ dialogPathId, dialog: dialogComponent, choices: choicesComponent }, index) => {
            const isVisible = dialogPathsVisibleToUser.includes(dialogPathId)

            const isLastVisibleDialog = index === currentDialogIndex
            if (isVisible && isLastVisibleDialog) {
              if (!choicesComponent) {
                return (
                  <Button
                    onClick={() => {
                      setCurrentDialogIndex(currentDialogIndex + 1)
                    }}
                  >
                    Continue
                  </Button>
                )
              }
              if (choicesComponent) {
                return (
                  <>
                    {choicesComponent({
                      levelDialog,
                      isLastVisibleDialog,
                      setCurrentDialogIndex,
                      continueDialog,
                      jumpToDialogPath,
                      ...parentProps
                    })}
                  </>
                )
              }
            }
          }
        )}
      </div>
    </div>
  )
}

export default MonologDialogContainer
