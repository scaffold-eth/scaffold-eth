import React from 'react'
import { Link } from 'react-router-dom'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'DAOHack'
export const DIALOG_PART_ID = `${LEVEL_ID}/PresentTask`

const _dialog = [
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk4551.png'
          text='As faith would have it, I have something of a situation my hands'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk4551.png'
          text='One of my previous partners helped me setup an organiztion.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk4551.png'
          text='It turns out that even though he said so hed dit not know what he was doing.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk4551.png'
          text='I need someone to help me get out of this mess.'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk4551.png'
          text='Someone with a specific set of skills'
        />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='Maybe someone like you?' />
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setDaoContractWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              onClick={() => {
                setDaoContractWindowVisibility(true)
                globalGameActions.dialog.continueDialog()
              }}
            >
              Continue
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
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='What do you make of this?' />
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
            pathToAvatar='./assets/punk4551.png'
            text='We have some funds stuck in here.'
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='Can you help us rescue them?' />
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
              onClick={() => {
                setExplanationWindowVisibility(true)
                globalGameActions.dialog.continueDialog()
              }}
            >
              Continue
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
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text='Good, good ...' />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft pathToAvatar='./assets/punk4551.png' text={`Let's hit the roof.`} />
        </>
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/decentralized-exchange'>
              <Button className='is-warning'>Take stairs to roof top</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
