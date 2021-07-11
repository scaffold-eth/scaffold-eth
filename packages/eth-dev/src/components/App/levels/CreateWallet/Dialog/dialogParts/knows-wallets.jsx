import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'create-wallet/knows-wallets'

const dialog = [
  {
    component: ({ currentDialog, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text={`Great! Let's generate one for you.`} />
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID)

export default enrichedDialog
