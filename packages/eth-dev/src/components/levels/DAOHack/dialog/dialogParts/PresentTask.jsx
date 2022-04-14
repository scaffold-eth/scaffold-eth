import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/PresentTask`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        As faith would have it, I have something of a situation my hands
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        One of my previous partners helped me setup an organiztion.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        It turns out that even though he said so hed dit not know what he was doing.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        I need someone to help me get out of this mess.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        Someone with a specific set of skills
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Maybe someone like you?</SpeakerLeft>
    ),
    choices: ({ continueDialog, setDaoContractWindowVisibility }) => (
      <Button
        onClick={() => {
          setDaoContractWindowVisibility(true)
          continueDialog()
        }}
      >
        Continue
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>What do you make of this?</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        We have some funds stuck in here.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Can you help us rescue them?</SpeakerLeft>
    ),
    choices: ({ continueDialog, setExplanationWindowVisibility }) => (
      <Button
        onClick={() => {
          setExplanationWindowVisibility(true)
          continueDialog()
        }}
      >
        Continue
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Good, good ...</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>Let's hit the roof</SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.Challenge3Dex.path}>
        <Button className='is-warning'>Take stairs to roof top</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
