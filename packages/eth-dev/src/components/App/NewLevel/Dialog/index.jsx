/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react'
import dialog from './dialogArray'

const DIALOG_PART_ID = 'intro/start'

const enrichDialog = _dialog => {
  return _dialog.map(dialogStep => {
    return { dialogPartId: DIALOG_PART_ID, ...dialogStep }
  })
}

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

const Dialog = ({ actions, dialog: { currentDialogIndex } }) => {
  useEffect(() => {
    actions.dialog.initDialog({ dialogLength: dialog.length })
  }, [])

  return (
    <div id='newLevelDialog'>
      <div
        style={{
          float: 'left',
          width: '100%',
          marginTop: '15px'
        }}
      >
        {dialog.map((dialogPart, index) => {
          const isLastVisibleDialog = index === currentDialogIndex
          const isFinalDialog = index === dialog.length - 1

          if (index <= currentDialogIndex) {
            return (
              <>
                {dialogPart.component}

                {isLastVisibleDialog && !isFinalDialog && (
                  <button
                    type='button'
                    className='nes-btn'
                    id='continue'
                    onClick={() => actions.dialog.continueDialog()}
                    style={{ ...styles.button }}
                  >
                    Continue
                  </button>
                )}
              </>
            )
          }
          return <></>
        })}
      </div>
    </div>
  )
}

export default Dialog
