import React, { useEffect } from 'react'
import { Button } from '../../../gameItems/components'
import dialogArray from './dialogArray'

const Dialog = ({ actions, dialog }) => {
  const { currentDialogIndex, dialogPathsVisibleToUser } = dialog

  useEffect(() => {
    actions.dialog.initDialog({
      initialDialogPathId: 'template-level/start',
      currentDialog: dialogArray
    })
  }, [])

  // add isVisibleToUser flag to all dialog parts where 'dialogPathId' is not included in dialogPathsVisibleToUser[]
  const filteredDialog = dialogArray.map((dialogPart, index) => {
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
        const isFinalDialog = index === dialogArray.length - 1

        return (
          <>
            {dialogPart.isVisibleToUser &&
              dialogPart.component({ dialog, isLastVisibleDialog, actions })}

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
