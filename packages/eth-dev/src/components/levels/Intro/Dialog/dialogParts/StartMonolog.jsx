import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import { DIALOG_PART_ID as FIRST_CONTACT } from './FirstContact'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/StartMonolog`

const _dialog = [
  {
    dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png'>Ah what a view!</SpeakerRight>,
    choices: null
  },
  {
    dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png'>ETH City!</SpeakerRight>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>Feels good to be back.</SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>Feels good to be home ...</SpeakerRight>
    ),
    choices: ({ jumpToDialogPath, setDidFinishMonolog }) => {
      return (
        <Button
          onClick={() => {
            setDidFinishMonolog(true)

            jumpToDialogPath({
              dialogPathId: FIRST_CONTACT
            })

            // TODO:
            // showMessageNotification({ delayInSeconds: 2 })
          }}
        >
          Continue
        </Button>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
