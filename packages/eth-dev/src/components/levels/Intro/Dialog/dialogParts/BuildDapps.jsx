import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/BuildDapps`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png'>
          I want to jump back into helping the gangs!
        </SpeakerRight>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          I do hope you still know where you loyalty lies ...
        </SpeakerLeft>
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
      dialog: () => (
        <SpeakerRight pathToAvatar='./assets/punk5950.png'>No doubt about it</SpeakerRight>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          Well then, let's get you up to speed
        </SpeakerLeft>
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
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          Start by reconnecting to the city network
        </SpeakerLeft>
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
      dialog: () => <SpeakerRight pathToAvatar='./assets/punk5950.png'>I'm in!</SpeakerRight>,
      choices: null
    }
  },
  {
    components: {
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Good</SpeakerLeft>,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          I already have a job for you
        </SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          Only if you are interested ofc ...
        </SpeakerLeft>
      ),
      choices: ({ isLastVisibleDialog }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Link to={routesMap.Challenge0SimpleNFT.path}>
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
