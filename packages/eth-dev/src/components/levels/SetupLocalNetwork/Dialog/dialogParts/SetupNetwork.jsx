import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'SetupLocalNetwork'
export const DIALOG_PART_ID = `${LEVEL_ID}/SetupNetwork`

const _dialog = [
  {
    components: {
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='ofc you do' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Great to see that you still now your stuff'
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/underflow-bug'>
              <Button>Continue</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
