import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/BuildDapps`

const _dialog = [
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>
        I want to jump back into helping the gangs!
      </SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I do hope you still know where your loyalty lies ...
      </SpeakerLeft>
    ),
    choices: ({ continueDialog }) => {
      return (
        <Button className='is-warning' onClick={() => continueDialog()}>
          No doubt about it
        </Button>
      )
    }
  },
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>No doubt about it</SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Well then, let's get you up to speed
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Start by reconnecting to the city network
      </SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.SetupLocalNetwork.path}>
        <Button className='is-warning'>Setup Network</Button>
      </Link>
    )
  }
  /*
  {
    dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png'>I'm in!</SpeakerRight>,
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Good</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I already have a job for you</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Only if you are interested ofc ...
      </SpeakerLeft>
    ),
    choices: () => {
      <Link to={routesMap.Challenge0SimpleNFT.path}>
        <Button className='is-warning'>Drive into the city</Button>
      </Link>
    )
  }
  */
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
