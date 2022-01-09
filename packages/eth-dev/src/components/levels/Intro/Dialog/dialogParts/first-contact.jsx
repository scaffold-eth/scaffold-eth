import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft, SpeakerRight } from '../components'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'intro/first-contact'

const _dialog = [
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerRight pathToAvatar='./assets/punk_anon.png' text='Hello old friend.' />
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerRight
            pathToAvatar='./assets/punk_anon.png'
            text='Nice to see that you have not given up on this city!'
          />
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerRight
            pathToAvatar='./assets/punk_anon.png'
            text='What have you been up to all this time?'
          />
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerRight pathToAvatar='./assets/punk_anon.png' text='...' />
        </>
      )
    }
  },
  {
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerRight
            pathToAvatar='./assets/punk_anon.png'
            text='Nevermind! We have more important things to deal with at the moment!'
          />
        </>
      )
    }
  },
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => {
      return (
        <>
          <SpeakerRight pathToAvatar='./assets/punk_anon.png' text='Can you help us?' />
          {isLastVisibleDialog && (
            <Button className='is-warning' onClick={() => actions.dialog.continueDialog()}>
              Sure! What do you need?
            </Button>
          )}
        </>
      )
    }
  },
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerRight
          text='I need you to connect to the cities network!'
          pathToAvatar='./assets/punk_anon.png'
        />
        {isLastVisibleDialog && (
          <Button onClick={() => actions.level.setCurrentLevel({ levelId: 'setup-local-network' })}>
            Continue
          </Button>
        )}
      </>
    )
  },
  {
    hasChoices: true,
    component: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
      <>
        <SpeakerRight
          text='Here, follow these instructions ...'
          pathToAvatar='./assets/punk_anon.png'
        />
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
