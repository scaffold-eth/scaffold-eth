import React from 'react'
import Typist from 'react-typist'
import { Button } from '../../../gameItems/components'
import { SpeakerLeft } from '../components'
import { enrichDialog } from '../helpers'

export const DIALOG_PATH_ID = 'intro/experienced-dev'

const dialog = [
  {
    component: ({ currentDialog, isLastVisibleDialog, actions }) => {
      console.log({ isLastVisibleDialog, currentDialog })
      return (
        <>
          <SpeakerLeft
            text={`Cool! For the game to run smoothly you'll need to do the following...`}
          />
          {isLastVisibleDialog && (
            <Button
              id='continue'
              onClick={() => {
                actions.setInitialInstructionsWindowVisibility(true)
              }}
            >
              Show instructions
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID)

export default enrichedDialog
