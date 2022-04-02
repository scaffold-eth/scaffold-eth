import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'NFTStore'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text={`I'm sending you some coordinates now. I'll call you again when you're there.`}
          />
        </>
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
            text='0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
          />
        </>
      ),
      choices: ({ isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                globalGameActions.background.setCurrentBackground({ background: 'NiftyShop' })
                globalGameActions.dialog.continueDialog()
              }}
            >
              Go to coordinates
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
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Welcome to the shop!' />
        </>
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
            text='As you can see, some parts are already setup.'
          />
        </>
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
            text='What is missing now is, an interface for our members to obtain their membership badges.'
          />
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setHistoryWindowVisibility
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
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Greate job!' />
        </>
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
            text='Such an elegant solution to our problem!'
          />
        </>
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
            text={`I'll advise my people to pick up their Tokens right away.`}
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text={`It's late.`} />
        </>
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
            text='You can stay at one of my apartments for now.'
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text={`I'll ping you tomorrow`} />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/decentralized-staking-app'>
              <Button className='is-warning'>Go to apartment</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
