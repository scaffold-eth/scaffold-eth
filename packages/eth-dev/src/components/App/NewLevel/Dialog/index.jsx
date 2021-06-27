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

const Dialog = ({
  actions,
  dialog: { dialogLength, currentDialogIndex, dialogPathsVisibleToUser }
}) => {
  useEffect(() => {
    actions.dialog.initDialog({
      initialDialogPartId: 'intro/start',
      dialogLength: dialog.length
    })
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
          const isVisibleToUser =
            index <= currentDialogIndex &&
            dialogPathsVisibleToUser.includes(dialogPart.dialogPathId)
          const isLastVisibleDialog = index === currentDialogIndex
          const isFinalDialog = index === dialog.length - 1

          console.log({
            dialogPathsVisibleToUser,
            dialogPathId: dialogPart.dialogPathId,
            isVisibleToUser
          })

          if (isVisibleToUser) {
            return (
              <>
                {dialogPart.component({ actions })}

                {isLastVisibleDialog && !isFinalDialog && !dialogPart.hasChoices && (
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
