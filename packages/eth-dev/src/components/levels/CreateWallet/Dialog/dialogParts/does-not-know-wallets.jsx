import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PATH_ID = 'create-wallet/does-not-know-wallets'

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`So you don't know what a wallet is. No problem, no problem.`}
        />
      ),
      choices: null
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
