import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'SetupMetamask'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    components: {
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Ok ...' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text={`Let's get you hooked up!`} />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        loadWeb3Modal,
        setInstructionsWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.continueDialog()
                  loadWeb3Modal()
                  console.log('TODO: connect to metamask')
                }}
              >
                Connect to Wallet
              </Button>
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.dialog.continueDialog()
                  setInstructionsWindowVisibility(true)
                }}
              >
                Setup Metamask
              </Button>
            </>
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
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text='Now head into the city. I want to show you something.'
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/underflow-bug'>
              <Button className='is-warning'>Go into City</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
