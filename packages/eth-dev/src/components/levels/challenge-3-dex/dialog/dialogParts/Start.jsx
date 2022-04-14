import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { backgroundIds } from '../../../../gameItems/components/Background/backgroundsMap'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Challenge3Dex'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I wanted you to see this.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        This dish you see here has a very important role to play ...
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        It gives us a strong connection to the city network.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        A connection we need for what we are working on in the cellars underneath this building.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I've but you on the whitelist. You should are now able to access it.
      </SpeakerLeft>
    ),
    choices: ({ setBackgroundId, continueDialog }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setBackgroundId(backgroundIds.ExchangeRed)
          continueDialog()
        }}
      >
        Go downstairs
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        What do you think? pretty impressive huh?
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        We are planning to give the whole city access to it.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        In the future I believe running this will almost tripple our income.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        But as you can see it is not working yet ...
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I've already sent you the project files
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
        Open files
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Great!</SpeakerLeft>,
    choices: () => (
      <Link to={routesMap.Challenge5MultiSig.path}>
        <Button className='is-warning'>Go home</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
