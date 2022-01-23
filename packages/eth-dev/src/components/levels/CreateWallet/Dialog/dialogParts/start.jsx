import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PATH_ID as DOES_KNOW_WALLETS_PATH_ID } from './knows-wallets'
import { DIALOG_PATH_ID as DOES_NOT_KNOW_WALLETS_PATH_ID } from './does-not-know-wallets'

export const DIALOG_PATH_ID = 'create-wallet/start'

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Welcome home!' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text={`Isn't she beautifull?`} />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`We should probably head to my base. I've got everything we need setup there.`}
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <>
                <Button
                  onClick={() => {
                    globalGameActions.dialog.continueDialog()
                    globalGameActions.background.setCurrentBackground({ background: 'workstation' })
                  }}
                >
                  Continue
                </Button>
              </>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='So, do you know what a wallet is?'
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setDetailsOnWalletsWindowVisibility
      }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <>
                <Button
                  className='is-warning'
                  onClick={() =>
                    globalGameActions.dialog.jumpToDialogPath({
                      currentDialog,
                      dialogPathId: DOES_KNOW_WALLETS_PATH_ID
                    })
                  }
                >
                  Yes, I'm familiar with wallets
                </Button>
                <Button
                  className='is-warning'
                  onClick={() => {
                    globalGameActions.dialog.continueDialog()
                    setDetailsOnWalletsWindowVisibility(true)
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
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='I have some information on them here.'
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setDetailsOnWalletsWindowVisibility
      }) => {
        return <></>
      }
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
