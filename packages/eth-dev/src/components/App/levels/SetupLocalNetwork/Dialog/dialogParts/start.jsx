import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft, SpeakerRight } from '../components'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'setup-local-network/start'

const dialog = [
  {
    component: ({ actions }) => (
      <SpeakerLeft
        text='Welcome to eth.dev, a game for developers learning Ethereum.'
        pathToAvatar='./assets/punk5950.png'
      />
    )
  },
  {
    component: ({ actions }) => (
      <SpeakerLeft
        text="I'm *Punk#5950* and I'm in charge of **onbaoarding** around here..."
        pathToAvatar='./assets/punk5950.png'
      />
    )
  },
  {
    hasChoices: true,
    component: ({ isLastVisibleDialog, actions }) => (
      <>
        <SpeakerLeft
          text='To begin the game, please use the **wallet generator** to create an identity:'
          pathToAvatar='./assets/punk5950.png'
        />
        {isLastVisibleDialog && (
          <Button
            onClick={() => {
              actions.setWalletGeneratorVisibility(true)
            }}
          >
            Open Wallet Generator
          </Button>
        )}
      </>
    )
  },
  {
    component: ({ actions }) => <SpeakerLeft text='NICE' pathToAvatar='./assets/punk5950.png' />
  }
  /*
  {
    hasChoices: true,
    component: ({ currentDialog, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerRight
          text=''
        />
        {isLastVisibleDialog && (
          <>
            <Button
              onClick={() =>
                actions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: EXPERIENCED_DIALOG_PATH_ID
                })
              }
            >
              I'm an experienced developer
            </Button>
            <Button
              onClick={() =>
                actions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: BEGINNER_DIALOG_PATH_ID
                })
              }
            >
              I'm more of a beginner
            </Button>
          </>
        )}
      </>
    )
  } */
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID, [])

export default enrichedDialog
