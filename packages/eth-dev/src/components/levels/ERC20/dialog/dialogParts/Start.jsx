import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'ERC20/Start'

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Here is the code:</SpeakerLeft>
    ),
    choices: ({ isLastVisibleDialog, continueDialog, setContractWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setContractWindowVisibility(true)
          continueDialog()
        }}
      >
        Show Contract
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>What do you think?</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        We have some more documentation that goes with this. Here, take a look.
      </SpeakerLeft>
    ),
    choices: ({ setExplanationWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setExplanationWindowVisibility(true)
        }}
      >
        Open Documentation
      </Button>
    )
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Great!</SpeakerLeft>,
    choices: null
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
