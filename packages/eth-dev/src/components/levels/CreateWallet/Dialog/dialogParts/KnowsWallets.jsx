import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/KnowsWallets`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`Great! Let's generate one for you.`}
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setCreateWalletWindowVisibility
      }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                className='is-warning'
                onClick={() => {
                  setCreateWalletWindowVisibility(true)
                  globalGameActions.wallet.showWallet()
                  globalGameActions.dialog.continueDialog()
                }}
              >
                Setup Wallet
              </Button>
            )}
          </>
        )
      }
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
