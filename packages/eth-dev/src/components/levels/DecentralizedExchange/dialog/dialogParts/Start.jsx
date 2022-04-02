import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'DecentralizedExchange/Start'

const _dialog = [
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='I wanted you to see this.' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='This dish you see here has a very important role to play.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='It gives us a strong connection to the city network.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='A connection we need for what we are working on in the cellars underneath this building.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`I've but you on the whitelist. You should are now able to access it.`}
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                globalGameActions.background.setCurrentBackground({
                  background: 'ExchangeRed'
                })
                globalGameActions.dialog.continueDialog()
              }}
            >
              Go downstairs
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
          text='What do you think? pretty impressive huh?'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='We are planning to give the whole city access to it.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='In the future I believe running this will almost tripple our income.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='But as you can see it is not working yet ...'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`I've already sent you the project files`}
        />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setExplanationWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                setExplanationWindowVisibility(true)
                globalGameActions.dialog.continueDialog()
              }}
            >
              Open files
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
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Great!' />,
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/multisig'>
              <Button className='is-warning'>Go home</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
