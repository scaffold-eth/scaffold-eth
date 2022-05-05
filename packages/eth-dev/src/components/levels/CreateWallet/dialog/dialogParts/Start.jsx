import React from 'react'

import { enrichDialog } from '../../../../../helpers'
import { backgroundIds } from '../../../../gameItems/components/Background/backgroundsMap'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as DOES_KNOW_WALLETS_PATH_ID } from './KnowsWallets'
import { DIALOG_PART_ID as DOES_NOT_KNOW_WALLETS_PATH_ID } from './DoesNotKnowWallets'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ahhh ...</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Isn't she beautifull?</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        We should probably head to my base. I've got everything we need there.
      </SpeakerLeft>
    ),
    choices: ({
      currentDialogIndex,
      isLastVisibleDialog,
      setBackgroundId,
      setCurrentDialogIndex,
      continueDialog
    }) => {
      return (
        <Button
          onClick={() => {
            setBackgroundId(backgroundIds.Workstation)
            continueDialog()
          }}
        >
          Continue
        </Button>
      )
    }
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        So, do you know what a wallet is?
      </SpeakerLeft>
    ),
    choices: ({
      levelDialog,
      jumpToDialogPath,
      isLastVisibleDialog,
      setCurrentDialogIndex,
      currentDialogIndex,
      continueDialog,
      setDetailsOnWalletsWindowVisibility
    }) => {
      return (
        <>
          <Button
            className='is-warning'
            onClick={() => {
              continueDialog()
              jumpToDialogPath({
                dialogPathId: DOES_KNOW_WALLETS_PATH_ID
              })
            }}
          >
            Yes, I'm familiar with wallets
          </Button>
          <Button
            className='is-warning'
            onClick={() => {
              setDetailsOnWalletsWindowVisibility(true)
              jumpToDialogPath({
                dialogPathId: DOES_NOT_KNOW_WALLETS_PATH_ID
              })
            }}
          >
            What is a wallet?
          </Button>
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
