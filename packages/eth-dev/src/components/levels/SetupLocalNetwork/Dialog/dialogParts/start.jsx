import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft, SpeakerRight } from '../components'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'setup-local-network/start'

const _dialog = [
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        {isLastVisibleDialog && (
          <Button
            onClick={() => {
              actions.dialog.continueDialog()
            }}
          >
            {`<waiting for network connection>`}
          </Button>
        )}
      </>
    )
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerRight text='Great! Seems like you still now your stuff ...' />
      </>
    )
  },
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerRight
          text={`Let's head into the city, I've arranged a meating with some of my old friends...`}
        />
        {isLastVisibleDialog && (
          <Button
            className='is-warning'
            onClick={() => {
              actions.level.setCurrentLevel({ levelId: 'city-at-war' })
            }}
          >
            Drive into city
          </Button>
        )}
      </>
    )
  }
  /*
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
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

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID, [])

export default enrichedDialog
