import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'SetupMetamask'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ok ...</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Let's get you hooked up!</SpeakerLeft>
    ),
    choices: ({ continueDialog, loadWeb3Modal, setInstructionsWindowVisibility }) => (
      <>
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            loadWeb3Modal()
            console.log('TODO: connect to metamask')
          }}
        >
          Connect to Wallet
        </Button>
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            setInstructionsWindowVisibility(true)
          }}
        >
          Setup Metamask
        </Button>
      </>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Now head into the city. I want to show you something.
      </SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.UnderflowBug.path}>
        <Button className='is-warning'>Go into City</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
