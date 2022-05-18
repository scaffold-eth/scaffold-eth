import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { backgroundIds } from '../../../../gameItems/components/Background/backgroundsMap'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Challenge1DecentralizedStaking'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
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
    choices: ({ continueDialog, setUserPickedPositiveResponse }) => (
      <>
        <Button
          className='is-warning'
          onClick={() => {
            setUserPickedPositiveResponse(true)
            continueDialog()
          }}
        >
          Yes
        </Button>
        <Button
          className='is-warning'
          onClick={() => {
            setUserPickedPositiveResponse(false)
            continueDialog()
          }}
        >
          No, let me sleep!
        </Button>
        <Button
          className='is-warning'
          onClick={() => {
            setUserPickedPositiveResponse(false)
            continueDialog()
          }}
        >
          Let me sleep! God damn it!
        </Button>
      </>
    )
  },
  {
    dialog: ({ userPickedPositiveResponse }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        {userPickedPositiveResponse && `Always ready for action! I think we'll get along great`}
        {!userPickedPositiveResponse && 'Grumpy, humpy!'}
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I want to tell you about one of my projects and I would like you to have a view while we
        discuss it
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setBackgroundId }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setBackgroundId(backgroundIds.RoofSatellite)
          continueDialog()
        }}
      >
        Head to the roof
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Ahh the sun is rising</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I would like to show you some of my plans me and the gang have been working on
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I'm sending you the files now</SpeakerLeft>
    ),
    choices: ({ continueDialog, setHistoryWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setHistoryWindowVisibility(true)
          continueDialog()
        }}
      >
        Open Files
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Thanks!</SpeakerLeft>,
    choices: () => (
      <Link to={routesMap.Challenge2TokenVendor.path}>
        <Button className='is-warning'>Go back to sleep</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
