import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as PRESENT_TASK } from './PresentTask'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/DuringTheDay`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>During the day</SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Hmmm ...</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        I've heard about people like you.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        We are different and yet alike.
      </SpeakerLeft>
    ),
    choices: ({ jumpToDialogPath }) => (
      <Button
        onClick={() => {
          jumpToDialogPath({
            dialogPathId: PRESENT_TASK
          })
        }}
      >
        Continue
      </Button>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
