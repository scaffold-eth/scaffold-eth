import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'template-level/start'

const dialog = [
  {
    component: ({ currentDialog, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text={`Let's generate a wallet for you ...`} />
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID)

export default enrichedDialog
