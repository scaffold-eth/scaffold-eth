import React from 'react'
import { Link } from 'react-router-dom'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'GamblingContract/Start'

const _dialog = [
  {
    components: {
      dialog: () => (
        <>
          <SpeakerLeft
            pathToAvatar='./assets/punk_anon.png'
            text='Ok. This is the machine I was talking about.'
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
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='And this is the code.' />
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
            text='Can you figure out what happened?'
          />
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setContractWindowVisibility,
        setExplanationWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                setContractWindowVisibility(true)
                globalGameActions.dialog.continueDialog()
                // setExplanationWindowVisibility(true)
                // globalGameActions.dialog.continueDialog()
              }}
            >
              Show Contract
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
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='What do you think?' />
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
            text='We have some more documentation that goes with this. Here, take a look.'
          />
        </>
      ),
      choices: ({
        dialog: { currentDialog },
        isLastVisibleDialog,
        globalGameActions,
        setContractWindowVisibility,
        setExplanationWindowVisibility
      }) => (
        <>
          {isLastVisibleDialog && (
            <Button
              className='is-warning'
              onClick={() => {
                // setContractWindowVisibility(true)
                setExplanationWindowVisibility(true)
              }}
            >
              Open Documentation
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
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Nice!' />
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
            text='Running these should yield us some juicy profits'
          />
        </>
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`I think it's time to onboard you to some of my more ambitiuse plans ...`}
        />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <>
          {isLastVisibleDialog && (
            <Link to='/dao-hack'>
              <Button>Continue</Button>
            </Link>
          )}
        </>
      )
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
