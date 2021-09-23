import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'setup-local-network/beginner-dev'

const _dialog = [
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerLeft
          text={`Not to worry, not to worry - I've got you covered. May I suggest that you head over to our dear friends at cryptozombies.io`}
        />
        <a href='https://cryptozombies.io'>
          <Button id='cryptozombies-io'>Check out cryptozombies.io</Button>
        </a>
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
