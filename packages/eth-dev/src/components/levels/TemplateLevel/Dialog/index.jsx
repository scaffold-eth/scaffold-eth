import React, { useEffect } from 'react'
import { Button } from '../../../gameItems/components'
import levelDialog from './dialogArray'

export const LEVEL_ID = 'TemplateLevel'

const Dialog = ({ globalGameActions, dialog }) => {
  const { currentDialogIndex, dialogPathsVisibleToUser } = dialog

  useEffect(() => {
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  // add isVisibleToUser flag to all dialog parts where 'dialogPathId' is not included in dialogPathsVisibleToUser[]
  const filteredDialog = levelDialog.map((dialogPart, index) => {
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
        const isFinalDialog = index === levelDialog.length - 1

        return (
          <>
            {dialogPart.isVisibleToUser &&
              dialogPart.component({ dialog, isLastVisibleDialog, globalGameActions })}

            {isLastVisibleDialog && !dialogPart.hasChoices && !isFinalDialog && (
              <Button onClick={() => globalGameActions.dialog.continueDialog()}>Continue</Button>
            )}
          </>
        )
      })}
    </div>
  )
}

export default Dialog
