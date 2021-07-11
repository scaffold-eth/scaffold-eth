import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft, SpeakerRight } from '../components'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'setup-local-network/start'

const dialog = [
  {
    component: ({ actions }) => <SpeakerLeft text='Welcome!' />
  },
  {
    component: ({ actions }) => (
      <SpeakerLeft text='You are about to embark on a journey into the development world of the Ethereum blockchain.' />
    )
  },
  {
    hasChoices: true,
    component: ({ currentDialog, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerRight
          text='This game is targeted towards more experienced developers (developers in general, not
              Ethereum specific.'
        />
        {isLastVisibleDialog && (
          <>
            <Button
              onClick={() =>
                actions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: EXPERIENCED_DIALOG_PATH_ID
                })
              }
            >
              I'm an experienced developer
            </Button>
            <Button
              onClick={() =>
                actions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: BEGINNER_DIALOG_PATH_ID
                })
              }
            >
              I'm more of a beginner
            </Button>
          </>
        )}
      </>
    )
  }
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID, [])

export default enrichedDialog
