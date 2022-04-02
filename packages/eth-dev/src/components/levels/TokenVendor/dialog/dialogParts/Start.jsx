import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'TokenVendor'
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
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Meh' />,
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
