import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as AT_NIGHT } from './AtNight'
import { DIALOG_PART_ID as DURING_THE_DAY } from './DuringTheDay'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  /*
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Hello there</SpeakerLeft>,
    choices: null
  },
  */
  {
    dialog: ({ isLastVisibleDialog }) => (
      <>
        <SpeakerLeft pathToAvatar='./assets/punk4551.png'>U up?</SpeakerLeft>
        <div style={{ marginLeft: 65, marginBottom: 10 }}>
          [
          <a
            target='_blank'
            rel='noreferrer'
            href='https://medium.com/immunefi/the-u-up-files-with-samczsun-1a9116cf6e74'
          >
            {'->'} Ethereum lore
          </a>
          ]
        </div>
      </>
    ),
    choices: ({ continueDialog, setUserPickedPositiveResponse }) => (
      <>
        <Button
          className='is-warning'
          onClick={() => {
            // setUserPickedPositiveResponse(true)
            continueDialog()
          }}
        >
          Yes
        </Button>
        <Button
          className='is-warning'
          onClick={() => {
            // setUserPickedPositiveResponse(false)
            continueDialog()
          }}
        >
          No, let me sleep!
        </Button>
      </>
    )
  },
  /*
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Hello there</SpeakerLeft>,
    choices: null
  },
  */
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        I believe we haven't had the pleasure
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        What a beautiful night, don't you think?
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        I dont know why, but I've always preferred working in the dark ...
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk4551.png'>How about you?</SpeakerLeft>,
    choices: ({ jumpToDialogPath }) => (
      <>
        <Button
          onClick={() => {
            jumpToDialogPath({
              dialogPathId: AT_NIGHT
            })
          }}
        >
          At night
        </Button>
        <Button
          onClick={() => {
            jumpToDialogPath({
              dialogPathId: DURING_THE_DAY
            })
          }}
        >
          During the day
        </Button>
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
