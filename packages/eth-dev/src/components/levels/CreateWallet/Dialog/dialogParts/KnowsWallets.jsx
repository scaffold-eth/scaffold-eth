import React from 'react'
import { Link } from 'react-router-dom'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/KnowsWallets`

const _dialog = [
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`Great! Let's get you connected.`}
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Button
                className='is-warning'
                onClick={() => {
                  globalGameActions.wallet.showWallet()
                  globalGameActions.dialog.continueDialog()
                }}
              >
                Setup Wallet
              </Button>
            )}
          </>
        )
      }
    }
  },
  {
    components: {
      dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Greast!' />,
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='I have a first job for you.' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`I'm sending you the coordinates now`}
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
            text='0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
          />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/insecure-gambling-contract'>
              <Button className='is-warning'>Go to coordinates</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
