import React from 'react'
import { SpeakerLeft, SpeakerRight } from '../components'
import { enrichDialog } from '../helpers'

import { DIALOG_PATH_ID as BEGINNER_DIALOG_PATH_ID } from './beginner-dev'
import { DIALOG_PATH_ID as EXPERIENCED_DIALOG_PATH_ID } from './experienced-dev'

export const DIALOG_PATH_ID = 'intro/start'

const styles = {
  button: {
    float: 'left',
    width: '96%',
    marginTop: '30px',
    marginLeft: '2%',
    marginRight: '5%',
    fontSize: '8px'
  }
}

const dialog = [
  {
    component: ({ actions }) => <SpeakerLeft text='Welcome!' />
  },
  {
    component: ({ actions }) => (
      <SpeakerLeft text='You are about to embark on a journey into the development world of the Ethereum blockchain.' />
    )
  },
  {
    component: ({ actions }) => (
      <SpeakerLeft
        text='This game is targeted towards more experienced developer (developer in general, not
            Ethereum specific.'
      />
    )
  },
  {
    hasChoices: true,
    component: ({ actions }) => (
      <>
        <SpeakerRight
          text='This game is targeted towards more experienced developer (developer in general, not
              Ethereum specific.'
        />
        <button
          type='button'
          className='nes-btn'
          id='continue'
          onClick={() =>
            actions.dialog.jumpToDialogPath({ dialogPartId: EXPERIENCED_DIALOG_PATH_ID })
          }
          style={{ ...styles.button }}
        >
          I'm an experienced developer
        </button>
        <button
          type='button'
          className='nes-btn'
          id='continue'
          onClick={() => actions.dialog.jumpToDialogPath({ dialogPartId: BEGINNER_DIALOG_PATH_ID })}
          style={{ ...styles.button }}
        >
          I'm more of a beginner
        </button>
      </>
    )
  }
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID)

export default enrichedDialog
