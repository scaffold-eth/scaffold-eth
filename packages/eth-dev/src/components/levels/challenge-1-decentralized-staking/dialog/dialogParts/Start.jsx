import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Challenge1DecentralizedStaking'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>U up?</SpeakerLeft>
          <div style={{ marginLeft: 65, marginBottom: 10 }}>
            [
            <a
              target='_blank'
              rel='noreferrer'
              href='https://medium.com/immunefi/the-u-up-files-with-samczsun-1a9116cf6e74'
            >
              {'->'} Ethereum lore
            </a>
            ]
          </div>
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setUserPickedPositiveResponse
      }) => (
        <>
          {isLastVisibleDialog && (
            <>
              <Button
                className='is-warning'
                onClick={() => {
                  setUserPickedPositiveResponse(true)
                  globalGameActions.dialog.continueDialog()
                }}
              >
                Yes
              </Button>
              <Button
                className='is-warning'
                onClick={() => {
                  setUserPickedPositiveResponse(false)
                  globalGameActions.dialog.continueDialog()
                }}
              >
                No, let me sleep!
              </Button>
              <Button
                className='is-warning'
                onClick={() => {
                  setUserPickedPositiveResponse(false)
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
      dialog: ({ userPickedPositiveResponse }) => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          {userPickedPositiveResponse && `Always ready for action! I think we'll get along great`}
          {!userPickedPositiveResponse && 'Grumpy, humpy!'}
        </SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          I want to tell you about one of my projects and I would like you to have a view while we
          discuss it
        </SpeakerLeft>
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
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ahh the sun is rising</SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          I would like to show you some of my plans me an the gang have been working on
        </SpeakerLeft>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
          I'm sending you the files now
        </SpeakerLeft>
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
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Thanks!</SpeakerLeft>,
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to={routesMap.Challenge2TokenVendor.path}>
              <Button className='is-warning'>Go back to sleep</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
