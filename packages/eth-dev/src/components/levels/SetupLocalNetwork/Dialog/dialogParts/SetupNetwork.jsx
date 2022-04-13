import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'SetupLocalNetwork'
export const DIALOG_PART_ID = `${LEVEL_ID}/SetupNetwork`

const _dialog = [
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>ofc you do</SpeakerLeft>,
    choices: ({ continueDialog, setInitChainInstructionsWindowVisibility }) => (
      <>
        <Button
          onClick={() => {
            continueDialog()
            setInitChainInstructionsWindowVisibility(false)
          }}
        >
          Done
        </Button>
      </>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Great to see that you still now your stuff!
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Let's head into the city. </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        There are some things I want to show you.
      </SpeakerLeft>
    ),
    choices: () => (
      <>
        <Link to={routesMap.CreateWallet.path}>
          <Button className='is-warning'>Go into City</Button>
        </Link>
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
