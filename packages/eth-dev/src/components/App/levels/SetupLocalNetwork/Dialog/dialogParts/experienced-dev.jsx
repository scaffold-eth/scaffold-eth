import React from 'react'
import Typist from 'react-typist'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'setup-local-network/experienced-dev'

const _dialog = [
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft
            text={`Cool! For the game to run smoothly you'll need to do the following...`}
          />
          {isLastVisibleDialog && (
            <Button
              onClick={() => {
                actions.setInitChainInstructionsWindowVisibility(true)
                actions.dialog.continueDialog()
              }}
            >
              Show instructions
            </Button>
          )}
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerLeft text={`Greate! Now let's get you a wallet.`} />
          {isLastVisibleDialog && (
            <Button
              onClick={() => {
                actions.level.setCurrentLevel({ levelId: 'create-wallet' })
              }}
            >
              Jump to create-wallet level
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
