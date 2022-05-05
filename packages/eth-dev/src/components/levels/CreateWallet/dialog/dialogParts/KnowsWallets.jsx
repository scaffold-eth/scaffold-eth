import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import DialogPartEnd from './End'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/KnowsWallets`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Great! Let's get you connected.
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setWalletIsVisible }) => {
      return (
        <Button
          className='is-warning'
          onClick={() => {
            setWalletIsVisible(true)
            continueDialog()
          }}
        >
          Setup Wallet
        </Button>
      )
    }
  },
  ...DialogPartEnd
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
