import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import  { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'SetupLocalNetwork'
export const DIALOG_PART_ID = `${LEVEL_ID}/SetupNetwork`

const _dialog = [
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>ofc you do</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Great to see that you still now your stuff
      </SpeakerLeft>
    ),
    choices: ({ isLastVisibleDialog }) => (
      <>
        {isLastVisibleDialog && (
          <Link to={routesMap.UnderflowBug.path}>
            <Button>Continue</Button>
          </Link>
        )}
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
