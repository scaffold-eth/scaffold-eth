import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft, SpeakerRight } from '../components'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'setup-local-network/start'

const _dialog = [
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <SpeakerLeft text='The city is at war, Anon.' pathToAvatar='./assets/punkatwar.png' />
    )
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <SpeakerLeft
        text='The *baronesses* of each warring faction are dedicating larger amounts of their spending on **brawling**.'
        pathToAvatar='./assets/punkatwar.png'
      />
    )
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <SpeakerLeft
        text='We need to write a **smart contract** that allows each *baroness* to stake part of their treasury towards a coordinated effort.'
        pathToAvatar='./assets/punkatwar.png'
      />
    )
  },
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerLeft
          text='Can you write this **smart contract** for us yet, or do you need more training?'
          pathToAvatar='./assets/punkatwar.png'
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
              I can write Solidity well!
            </Button>
            <Button
              onClick={() =>
                actions.dialog.jumpToDialogPath({
                  currentDialog,
                  dialogPathId: BEGINNER_DIALOG_PATH_ID
                })
              }
            >
              I'm looking for Solidity training.
            </Button>
          </>
        )}
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID, [])

export default enrichedDialog
