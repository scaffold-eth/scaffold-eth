import React from 'react'
import Typist from 'react-typist'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'setup-local-network/experienced-dev'

const dialog = [
  {
    component: ({ currentDialog, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft
            text={`Cool! For the game to run smoothly you'll need to do the following...`}
          />
          {isLastVisibleDialog && (
            <Button
              id='continue'
              onClick={() => {
                actions.setInitChainInstructionsWindowVisibility(true)
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
