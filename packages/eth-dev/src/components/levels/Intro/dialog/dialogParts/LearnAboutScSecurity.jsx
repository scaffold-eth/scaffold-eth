import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/LearnAboutScSecurity`

const _dialog = [
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>
        I've heard roumers that the amount of hacks happening in the city have reached a record
        high. Is that true?
      </SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Yeah you've heard right</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Seems like you haven't been as gone as you wanted everyone to believe ...
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I'm working on a case atm.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Can you help me?</SpeakerLeft>,
    choices: () => {
      return (
        <Link to={routesMap.UnderflowBug.path}>
          <Button className='is-warning'>Sure</Button>
        </Link>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
