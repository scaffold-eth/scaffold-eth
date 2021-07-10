import React, { useEffect } from 'react'
import { Button } from '../../../gameItems/components'
import dialog from './dialogArray'

const DIALOG_PART_ID = 'intro/start'

const Dialog = ({ actions, dialog: dialogProps }) => {
  const { dialogLength, currentDialogIndex, dialogPathsVisibleToUser } = dialogProps

  useEffect(() => {
    actions.dialog.initDialog({
      initialDialogPathId: DIALOG_PART_ID,
      dialogLength: dialog.length
    })
  }, [])

  // remove all dialog parts where 'dialogPathId' is not included in dialogPathsVisibleToUser[]
  const filteredDialog = dialog.filter((dialogPart, index) => {
    const reachedIndex = index <= currentDialogIndex
    const pathIsVisibleToUser = dialogPathsVisibleToUser.includes(dialogPart.dialogPathId)
    return reachedIndex && pathIsVisibleToUser
  })

  return (
    <div id='setupLocalNetworkLevelDialog'>
      <div
        style={{
          float: 'left',
          width: '100%',
          marginTop: '15px'
        }}
      >
        {filteredDialog.map((dialogPart, index) => {
          const isLastVisibleDialog = index === currentDialogIndex
          const isFinalDialog = index === dialog.length - 1

          return (
            <>
              {dialogPart.component({ currentDialog: dialog, isLastVisibleDialog, actions })}

              {isLastVisibleDialog && !dialogPart.hasChoices && !isFinalDialog && (
                <Button id='continue' onClick={() => actions.dialog.continueDialog()}>
                  Continue
                </Button>
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Dialog
