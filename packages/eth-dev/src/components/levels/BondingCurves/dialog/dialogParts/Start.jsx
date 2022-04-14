import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'BondingCurves/Start'

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Here, take a look:</SpeakerLeft>
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
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Nice! Seems like you still now your stuff!
      </SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.UnderflowBug.path}>
        <Button className='is-warning'>Next level</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
