import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'create-wallet/knows-wallets'

const _dialog = [
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text={`Great! Let's generate one for you.`} />
          {isLastVisibleDialog && (
            <Button
              onClick={() => {
                actions.setCreateWalletWindowVisibility(true)
                actions.dialog.continueDialog()
              }}
            >
              Setup Wallet
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
