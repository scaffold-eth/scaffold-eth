import React from 'react'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'
import { enrichDialog } from '../helpers'

export const DIALOG_PATH_ID = 'setup-local-network/generate-wallet'

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
