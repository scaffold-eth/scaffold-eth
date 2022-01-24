import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'TemplateLevel'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
      return (
        <>
          <SpeakerLeft text={`Let's generate a wallet for you ...`} />
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
