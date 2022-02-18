import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as DOES_KNOW_WALLETS_PATH_ID } from './KnowsWallets'
import { DIALOG_PART_ID as DOES_NOT_KNOW_WALLETS_PATH_ID } from './DoesNotKnowWallets'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Ahhh...' />
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
                    globalGameActions.background.setCurrentBackground({ background: 'Workstation' })
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
          text='I have some information on them here. Take a look.'
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

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
