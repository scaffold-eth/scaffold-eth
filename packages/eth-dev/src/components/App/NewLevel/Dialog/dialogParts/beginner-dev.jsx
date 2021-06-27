import React from 'react'
import { SpeakerLeft, SpeakerRight } from '../components'
import { enrichDialog } from '../helpers'

export const DIALOG_PATH_ID = 'intro/beginner-dev'

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
    hasChoices: true,
    component: ({ actions }) => (
      <>
        <SpeakerLeft
          text={`Not to worry, not to worry - I've got you covered. May I suggest that you head over to our dear friends at cryptozombies.io`}
        />
        <a href='https://cryptozombies.io'>
          <button
            type='button'
            className='nes-btn'
            id='cryptozombies-io'
            style={{ ...styles.button }}
          >
            Check out cryptozombies.io
          </button>
        </a>
      </>
    )
  }
]

const alternativeDialogBranches = ['intro/experienced-dev']

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID, alternativeDialogBranches)

export default enrichedDialog
