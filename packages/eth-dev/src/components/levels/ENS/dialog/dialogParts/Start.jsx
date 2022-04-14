import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'ENS/Start'

const _dialog = [
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Welcome back!</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Now that identification is no problem anymore things are starting to move much faster around
        here.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        However a new problem has materialized as a consequence of our new found flexibility.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Our data shows that we keep making mistakes and lossing funds by mismatching addresses.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        People seem to keep getting confused when working with many different addresses.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Is there anything we can do about that?
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        We have some more documentation that goes with this. Here, take a look.
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setExplanationWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setExplanationWindowVisibility(true)
          continueDialog()
        }}
      >
        Show documentation
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>This will help us a lot.</SpeakerLeft>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Great job, as usual</SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.CreateWallet.path}>
        <Button className='is-warning'>Leave rooftop</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
