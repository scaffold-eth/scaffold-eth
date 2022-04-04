import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'TokenVendor'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text='Come! I want to show you something.'
          />
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text='0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
          />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                globalGameActions.background.setCurrentBackground({
                  background: 'CitySkylineInsideNight'
                })
                globalGameActions.terminal.hideTerminal()
                globalGameActions.dialog.continueDialog()
                globalGameActions.terminal.showMessageNotification({ delayInSeconds: 4 })
              }}
            >
              Go to location
            </Button>
          )}
        </>
      )
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Welcome to one of our district offices.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text='I brought you here because I wanted to discuss our next venture.'
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Now that we have our exchange we need a quick way to issues new tokens for different ventures we are currently exploring.'
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setHistoryWindowVisibility,
        setContractWindowVisibility,
        setChallengeWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                setHistoryWindowVisibility(true)
                globalGameActions.dialog.continueDialog()
              }}
            >
              Show Documentation
            </Button>
          )}
        </>
      )
    }
  },
  {
    components: {
      dialog: () => <></>,
      choices: () => <></>
    }
  },
  {
    components: {
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Thanks!' />,
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/decentralized-staking-app'>
              <Button className='is-warning'>Next level</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
