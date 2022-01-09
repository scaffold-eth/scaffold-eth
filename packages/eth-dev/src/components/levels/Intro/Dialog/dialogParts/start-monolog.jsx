import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

import { DIALOG_PATH_ID as FIRST_CONTACT } from './first-contact'
import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'intro/start'

const _dialog = [
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text='Ah what a view!' />
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text='Ethereum City!' />
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text='Feels good to be back ...' />
        </>
      )
    }
  },
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions, finishMonolog }) => {
      return (
        <>
          <SpeakerLeft text='Feels good to be home ...' />
          <Button
            onClick={() => {
              finishMonolog()

              actions.dialog.jumpToDialogPath({
                currentDialog,
                dialogPathId: FIRST_CONTACT
              })
            }}
          >
            Continue
          </Button>
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
