import React from 'react'
import { Link } from 'react-router-dom'

import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const LEVEL_ID = 'Intro'
export const DIALOG_PART_ID = `${LEVEL_ID}/LearnAboutScSecurity`

const _dialog = [
  {
    components: {
      dialog: () => (
        <SpeakerRight
          pathToAvatar='./assets/punk5950.png'
          text={`I've heard roumers that the amount of hacks happening in the city have reached a record high. Is that true?`}
        />
      )
    },
    choices: null
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text={`Yeah you've heard right`} />
      )
    },
    choices: null
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft
          pathToAvatar='./assets/punk_anon.png'
          text={`Seems like you haven't been as gone as you wanted everyone to believe`}
        />
      )
    },
    choices: null
  },
  {
    components: {
      dialog: () => (
        <SpeakerLeft pathToAvatar='./assets/punk_anon.png' text='Here, can you work with this?' />
      ),
      choices: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => {
        return (
          <>
            {isLastVisibleDialog && (
              <Link to='/setup-local-network'>
                <Button className='is-warning'>Show Instructions</Button>
              </Link>
            )}
          </>
        )
      }
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
