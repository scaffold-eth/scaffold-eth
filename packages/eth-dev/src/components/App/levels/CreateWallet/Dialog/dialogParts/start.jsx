import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

import { DIALOG_PATH_ID as DOES_KNOW_WALLETS_PATH_ID } from './knows-wallets'
import { DIALOG_PATH_ID as DOES_NOT_KNOW_WALLETS_PATH_ID } from './does-not-know-wallets'

export const DIALOG_PATH_ID = 'create-wallet/start'

const _dialog = [
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text='We need to get you a wallet.' />
          {isLastVisibleDialog && (
            <>
              <Button
                onClick={() =>
                  actions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: DOES_KNOW_WALLETS_PATH_ID
                  })
                }
              >
                I know what a wallet is
              </Button>
              <Button
                onClick={() => {
                  actions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: DOES_NOT_KNOW_WALLETS_PATH_ID
                  })
                }}
              >
                What is a wallet?
              </Button>
            </>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
