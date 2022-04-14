import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'CreateDAO'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        What I need for my people is a way to coordinate arround the funds that we have obtained
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk4551.png'>
        A trustless way for the to coordinate around a specific goal.
      </SpeakerLeft>
    ),
    choices: ({ setExplanationWindowVisibility }) => (
      <>
        <Button
          className='is-warning'
          onClick={() => {
            setExplanationWindowVisibility(true)
          }}
        >
          Learn about DAOs
        </Button>
        <Button
          className='is-warning'
          onClick={() => {
            console.log('click')
          }}
        >
          Create a DAO
        </Button>
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
