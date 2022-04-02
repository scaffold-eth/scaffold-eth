import React from 'react'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as SETUP_NETWORK_PATH_ID } from './SetupNetwork'
import { DIALOG_PART_ID as BEGINNER_DEV_PATH_ID } from './BeginnerDev'

export const LEVEL_ID = 'SetupLocalNetwork'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Can you work with this?' />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: SETUP_NETWORK_PATH_ID
                  })
                }}
              >
                I know what to do
              </Button>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: BEGINNER_DEV_PATH_ID
                  })
                }}
              >
                I think I need some more training
              </Button>
            </>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
