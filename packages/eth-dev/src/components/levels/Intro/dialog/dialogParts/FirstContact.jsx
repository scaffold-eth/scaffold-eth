import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as BUILD_DAPPS } from './BuildDapps'
import { DIALOG_PART_ID as LEARN_ABOUT_SC_SECURITY } from './LearnAboutScSecurity'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/FirstContact`

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Hello old friend.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Nice to see that you have not given up on this city!
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        What have you been up to all this time?
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Why have you come back?</SpeakerLeft>
    ),
    choices: ({ jumpToDialogPath }) => {
      return (
        <>
          <Button
            className='is-warning'
            onClick={() =>
              jumpToDialogPath({
                dialogPathId: BUILD_DAPPS
              })
            }
          >
            Build dApps
          </Button>
          <Button
            className='is-warning'
            onClick={() =>
              jumpToDialogPath({
                dialogPathId: LEARN_ABOUT_SC_SECURITY
              })
            }
          >
            Learn about Smart Contract security
          </Button>
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
