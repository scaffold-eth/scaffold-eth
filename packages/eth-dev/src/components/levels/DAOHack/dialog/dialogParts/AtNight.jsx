import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as PRESENT_TASK } from './PresentTask'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/AtNight`

const _dialog = [
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>I also prefer the dark</SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Ahhh yes ...</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        I sensed that you and me are much alike.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        If the DEFI gods are staking on our side then I believe we may a achieve great things
        together, wouldn't you agree?
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>But more on that later.</SpeakerLeft>
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
