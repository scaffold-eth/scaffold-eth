import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'GnosisSafe/Start'

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ah man, here we go again</SpeakerLeft>
    ),
    choices: null
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
