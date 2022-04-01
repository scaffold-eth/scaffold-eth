import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'DecentralizedStakingApp'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='U up?' />
          <div style={{ marginLeft: 65, marginBottom: 10 }}>
            (
            <a
              target='_blank'
              rel='noreferrer'
              href='https://medium.com/immunefi/the-u-up-files-with-samczsun-1a9116cf6e74'
            >
              {'->'} Ethereum lore
            </a>
            )
          </div>
        </>
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
            <>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.continueDialog()
                }}
              >
                Yes
              </Button>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.continueDialog()
                }}
              >
                No, let me sleep!
              </Button>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.continueDialog()
                }}
              >
                Let me sleep! God damn it!
              </Button>
            </>
          )}
        </>
      )
    }
  },

  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Meh' />
        </>
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
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => <></>,
      choices: () => <></>
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Thanks!' />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                globalGameActions.levels.setCurrentLevel({ levelId: 'Intro' })
              }}
            >
              Next level
            </Button>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
