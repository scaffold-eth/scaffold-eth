import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'

export const DIALOG_PATH_ID = 'setup-local-network/start'

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text='Do you know how to setup and connect to a local ethereum environment or do you need some more training?'
          />
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setInitChainInstructionsWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <>
              <Button
                className='is-warning'
                onClick={() => {
                  setInitChainInstructionsWindowVisibility(true)
                  globalGameActions.dialog.continueDialog()
                }}
              >
                I know what to do
              </Button>
              <Button
                className='is-warning'
                onClick={() =>
                  globalGameActions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: BEGINNER_DIALOG_PATH_ID
                  })
                }
              >
                I think I need some more training
              </Button>
            </>
          )}
        </>
      )
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`Great! For the game to run smoothly you'll need to do the following ...`}
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setInitChainInstructionsWindowVisibility
      }) => <></>
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Nice! Seems like you still now your stuff!'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Next we need to get you a wallet.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`Let's head into the city! I've arranged a meating with some of our friends.`}
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Well ...' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Maybe not friends ...' />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                globalGameActions.level.setCurrentLevel({ levelId: 'create-wallet' })
              }}
            >
              Drive into city
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
