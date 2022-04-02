import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/BuildDapps`

const _dialog = [
  {
    components: {
      dialog: () => (
        <SpeakerRight
          pathToAvatar='./assets/punk5950.png'
          text='I want to jump back into helping the gangs!'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='I do hope you still know where you loyalty lies ...'
        />
      ),
      choices: ({ isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                className='is-warning'
                onClick={() => globalGameActions.dialog.continueDialog()}
              >
                No doubt about it
              </Button>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png' text='No doubt about it' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`Well then, let's get you up to speed`}
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setInitChainInstructionsWindowVisibility
      }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                onClick={() => {
                  setInitChainInstructionsWindowVisibility(true)
                  globalGameActions.dialog.continueDialog()
                }}
              >
                Continue
              </Button>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Start by reconnecting to the city network'
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setInitChainInstructionsWindowVisibility
      }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                onClick={() => {
                  setInitChainInstructionsWindowVisibility(false)
                  globalGameActions.dialog.continueDialog()
                }}
              >
                I'm in
              </Button>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png' text={`I'm in!`} />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Good' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='I already have a job for you' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Only if you are interested ofc ...'
        />
      ),
      choices: ({ isLastVisibleDialog }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Link to='/nft-store'>
                <Button className='is-warning'>Drive into the city</Button>
              </Link>
            )}
          </>
        )
      }
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
