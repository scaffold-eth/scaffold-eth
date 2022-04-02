import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

import { DIALOG_PART_ID as PRESENT_TASK } from './PresentTask'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/AtNight`

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerRight pathToAvatar='./assets/punk5950.png' text='I also prefer the dark' />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='Ahhh yes ...' />
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
            text='I sensed that you and me are much alike.'
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
            text={`If the DEFI gods are staking on our side then I believe we may a achieve great things together, wouldn't you agree?`}
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
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='But more on that later.' />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              onClick={() => {
                globalGameActions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: PRESENT_TASK
                })
              }}
            >
              Continue
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
