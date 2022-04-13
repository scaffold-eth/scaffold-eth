import React from 'react'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import DialogPartEnd from './End'

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
  ...DialogPartEnd
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
