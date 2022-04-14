import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'GamblingContract/Start'

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Ok. This is the machine I was talking about.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>And this is the code.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Can you figure out what happened?
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setContractWindowVisibility, setExplanationWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setContractWindowVisibility(true)
          continueDialog()
          // setExplanationWindowVisibility(true)
        }}
      >
        Show Contract
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>What do you think?</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        We have some more documentation that goes with this. Here, take a look.
      </SpeakerLeft>
    ),
    choices: ({ setContractWindowVisibility, setExplanationWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          // setContractWindowVisibility(true)
          setExplanationWindowVisibility(true)
        }}
      >
        Open Documentation
      </Button>
    )
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Nice!</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Running these should yield us some juicy profits
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I think it's time to onboard you to some of my more ambitiuse plans ...
      </SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.DAOHack.path}>
        <Button>Continue</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
