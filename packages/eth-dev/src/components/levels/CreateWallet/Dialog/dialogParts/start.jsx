import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

import { DIALOG_PATH_ID as DOES_KNOW_WALLETS_PATH_ID } from './knows-wallets'
import { DIALOG_PATH_ID as DOES_NOT_KNOW_WALLETS_PATH_ID } from './does-not-know-wallets'

export const DIALOG_PATH_ID = 'create-wallet/start'

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='First, we need to get you a wallet.'
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <>
                <Button
                  onClick={() =>
                    globalGameActions.dialog.jumpToDialogPath({
                      currentDialog,
                      dialogPathId: DOES_KNOW_WALLETS_PATH_ID
                    })
                  }
                >
                  I know what a wallet is
                </Button>
                <Button
                  onClick={() => {
                    globalGameActions.dialog.jumpToDialogPath({
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
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
