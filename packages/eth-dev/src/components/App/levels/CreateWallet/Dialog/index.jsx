import React, { useEffect } from 'react'
import { Button } from '../../../gameItems/components'
import dialog from './dialogArray'

const Dialog = ({ actions, dialog: dialogProps }) => {
  const { dialogLength, currentDialogIndex, dialogPathsVisibleToUser } = dialogProps

  useEffect(() => {
    actions.dialog.initDialog({
      initialDialogPathId: 'create-wallet/start',
      dialogLength: dialog.length
    })
  }, [])

  // add isVisibleToUser flag to all dialog parts where 'dialogPathId' is not included in dialogPathsVisibleToUser[]
  const filteredDialog = dialog.map((dialogPart, index) => {
    const reachedIndex = index <= currentDialogIndex
    const isVisibleToUser =
      dialogPathsVisibleToUser.includes(dialogPart.dialogPathId) && reachedIndex
    return {
      ...dialogPart,
      isVisibleToUser
    }
  })

  return (
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
            {dialogPart.isVisibleToUser &&
              dialogPart.component({ currentDialog: dialog, isLastVisibleDialog, actions })}

            {isLastVisibleDialog && !dialogPart.hasChoices && !isFinalDialog && (
              <Button onClick={() => actions.dialog.continueDialog()}>Continue</Button>
            )}
          </>
        )
      })}
    </div>
  )
}

export default Dialog
