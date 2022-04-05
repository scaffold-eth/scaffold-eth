import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as BUILD_DAPPS } from './BuildDapps'
import { DIALOG_PART_ID as LEARN_ABOUT_SC_SECURITY } from './LearnAboutScSecurity'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/FirstContact`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Hello old friend.</SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          Nice to see that you have not given up on this city!
        </SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          What have you been up to all this time?
        </SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Why have you come back?</SpeakerLeft>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <>
                <Button
                  className='is-warning'
                  onClick={() =>
                    globalGameActions.dialog.jumpToDialogPath({
                      currentDialog,
                      dialogPathId: BUILD_DAPPS
                    })
                  }
                >
                  Build dApps
                </Button>
                <Button
                  className='is-warning'
                  onClick={() =>
                    globalGameActions.dialog.jumpToDialogPath({
                      currentDialog,
                      dialogPathId: LEARN_ABOUT_SC_SECURITY
                    })
                  }
                >
                  Learn about Smart Contract security
                </Button>
              </>
            )}
          </>
        )
      }
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
