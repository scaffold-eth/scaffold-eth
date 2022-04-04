import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import { DIALOG_PART_ID as FIRST_CONTACT } from './FirstContact'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/StartMonolog`

const _dialog = [
  {
    components: {
      dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png' text='Ah what a view!' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png' text='Ethereum City!' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png' text='Feels good to be back.' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png' text='Feels good to be home ...' />
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
