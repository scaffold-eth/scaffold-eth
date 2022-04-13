import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/KnowsWallets`

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Great! Let's get you connected.
      </SpeakerLeft>
    ),
    choices: ({ isLastVisibleDialog, continueDialog, setWalletIsVisible }) => {
      return (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                setWalletIsVisible(true)
                continueDialog()
              }}
            >
              Setup Wallet
            </Button>
          )}
        </>
      )
    }
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Awesome!</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I have a first job for you.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I'm sending the coordinates now
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
      </SpeakerLeft>
    ),
    choices: ({ isLastVisibleDialog }) => (
      <>
        {isLastVisibleDialog && (
          <Link to={routesMap.GamblingContract.path}>
            <Button className='is-warning'>Go to coordinates</Button>
          </Link>
        )}
      </>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
