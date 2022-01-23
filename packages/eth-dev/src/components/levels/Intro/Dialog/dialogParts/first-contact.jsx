import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PATH_ID = 'intro/first-contact'

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Hello old friend.' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Nice to see that you have not given up on this city!'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='What have you been up to all this time?'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='...' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Nevermind! We have more important things to deal with at the moment!'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Can you help us?' />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                className='is-warning'
                onClick={() => globalGameActions.dialog.continueDialog()}
              >
                Sure! What do you need?
              </Button>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Great! First I need you to connect to the city network...'
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                onClick={() =>
                  globalGameActions.level.setCurrentLevel({ levelId: 'setup-local-network' })
                }
              >
                Continue
              </Button>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, actions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Here: Can you follow these instructions?'
        />
      ),
      choices: null
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID)

export default enrichedDialog
