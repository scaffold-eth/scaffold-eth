import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'DecentralizedStakingApp'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: () => (
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
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Meh' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='I want to tell you about one of my projects and I would like you to have a view while we discuss it'
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                globalGameActions.background.setCurrentBackground({
                  background: 'RoofSatellite'
                })
                globalGameActions.dialog.continueDialog()
              }}
            >
              Head to the roof
            </Button>
          )}
        </>
      )
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Ahh the sun is rising' />
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
          text='I would like to show you some of my plans me an the gang have been working on'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text={`I'm sending you the files now`} />
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
              Open Files
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
            <Link to='/token-vendor'>
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
