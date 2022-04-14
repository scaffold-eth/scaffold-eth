import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'FlashLoans/Start'

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ok. Let's get started.</SpeakerLeft>
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
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Great job, as usual!</SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.CreateWallet.path}>
        <Button className='is-warning'>Drive into City</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
