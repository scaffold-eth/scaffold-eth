import React from 'react'
import  { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/DoesNotKnowWallets`

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        So you don't know what a wallet is. No problem, no problem.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        May I suggest that you head over to our friends at cryptozombies.io?
      </SpeakerLeft>
    ),
    choices: ({ isLastVisibleDialog }) => (
      <>
        {isLastVisibleDialog && (
          <a href='https://cryptozombies.io' target='_blank' rel='noreferrer'>
            <Button className='is-warning'>Check out cryptozombies.io</Button>
          </a>
        )}
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
