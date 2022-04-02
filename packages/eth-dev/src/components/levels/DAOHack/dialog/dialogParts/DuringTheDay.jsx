import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as PRESENT_TASK } from './PresentTask'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/DuringTheDay`

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerRight pathToAvatar='./assets/punk5950.png' text='During the day' />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='Hmmm ...' />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk4551.png'
            text={`I've heard about people like you.`}
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk4551.png'
            text='We are different and yet alike.'
          />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              onClick={() => {
                globalGameActions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: PRESENT_TASK
                })
              }}
            >
              Continue
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
