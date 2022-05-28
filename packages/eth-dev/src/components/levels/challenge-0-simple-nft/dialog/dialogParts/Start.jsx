import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import { backgroundIds } from '../../../../gameItems/components/Background/backgroundsMap'

export const LEVEL_ID = 'Challenge0SimpleNFT'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I'm sending you some coordinates now. I'll call you again when you're there.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setBackgroundId }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setBackgroundId(backgroundIds.NiftyShop)
          continueDialog()
        }}
      >
        Go to coordinates
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Welcome to the shop!</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        As you can see, some parts are already setup.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        What is missing now is, an interface for our members to obtain their membership badges.
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
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Great job!</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Such an elegant solution to our problem!
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I'll advise my people to pick up their Tokens right away.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>It's late.</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        You can stay at one of my apartments for now.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I'll ping you tomorrow</SpeakerLeft>
    ),
    choices: ({}) => (
      <Link to={routesMap.Challenge1DecentralizedStaking.path}>
        <Button className='is-warning'>Go to apartment</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
