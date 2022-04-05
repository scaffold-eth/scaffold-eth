import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import { DIALOG_PART_ID as FIRST_CONTACT } from './FirstContact'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/StartMonolog`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png'>Ah what a view!</SpeakerRight>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png'>ETH City!</SpeakerRight>,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png'>Feels good to be back.</SpeakerRight>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png'>Feels good to be home ...</SpeakerRight>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        finishMonolog
      }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                onClick={() => {
                  if (finishMonolog) finishMonolog()

                  globalGameActions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: FIRST_CONTACT
                  })

                  globalGameActions.terminal.showMessageNotification({ delayInSeconds: 2 })
                }}
              >
                Continue
              </Button>
            )}
          </>
        )
      }
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
