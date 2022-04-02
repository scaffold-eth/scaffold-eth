import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as AT_NIGHT } from './AtNight'
import { DIALOG_PART_ID as DURING_THE_DAY } from './DuringTheDay'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='Hello there' />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk4551.png'
            text={`I believe we haven't had the pleasure`}
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk4551.png'
            text={`What a beautiful night, don't you think?`}
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk4551.png'
            text={`I dont know why, but I've always preferred working in the dark ...`}
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='How about you?' />
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setExplanationWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <>
              <Button
                onClick={() => {
                  globalGameActions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: AT_NIGHT
                  })
                }}
              >
                At night
              </Button>
              <Button
                onClick={() => {
                  globalGameActions.dialog.jumpToDialogPath({
                    currentDialog,
                    dialogPathId: DURING_THE_DAY
                  })
                }}
              >
                During the day
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
