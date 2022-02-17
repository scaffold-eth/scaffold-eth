import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'CreateWallet'
export const DIALOG_PART_ID = `${LEVEL_ID}/DoesNotKnowWallets`

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`So you don't know what a wallet is. No problem, no problem.`}
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text='May I suggest that you head over to our friends at cryptozombies.io?'
          />
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setInitChainInstructionsWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <a href='https://cryptozombies.io' target='_blank' rel='noreferrer' rel='noreferrer'>
              <Button className='is-warning'>Check out cryptozombies.io</Button>
            </a>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
