import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Challenge2TokenVendor'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Good morning!</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <>
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          Come! I want to show you something.
        </SpeakerLeft>
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0
        </SpeakerLeft>
      </>
    ),
    choices: ({ setBackgroundId, continueDialog }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setBackgroundId('CitySkylineInsideNight')
          // TODO:
          // hideTerminal()
          continueDialog()
          // showMessageNotification({ delayInSeconds: 4 })
        }}
      >
        Go to location
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Welcome to one of our district offices.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I brought you here because I wanted to discuss our next venture.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Now that we have our exchange we need a quick way to issues new tokens for different
        ventures we are currently exploring.
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setHistoryWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setHistoryWindowVisibility(true)
          continueDialog()
        }}
      >
        Show Documentation
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ah man! This is great!</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I think it is time to move on to the next chapter in our little adventure!
      </SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.Challenge3Dex.path}>
        <Button className='is-warning'>Go to roof top</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
