/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react'
import { SpeakerLeft, SpeakerRight } from './components'

const DIALOG_PART_ID = 'intro/start'

const __dialog = [
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Welcome!'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text:
      'You are about to embark on a journey into the development world of the Ethereum blockchain.'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text:
      'This game is targeted towards more experienced developer (developer in general, not Ethereum specific).',
    choices: [
      {
        id: 'experienced-dev-select',
        jumpToDialogPartId: 'experiencedDev',
        buttonText: `I'm an experienced developer`
      },
      {
        id: 'beginner-dev-select',
        jumpToDialogPartId: 'beginnerDev',
        buttonText: `I'm more of a beginner`
      }
    ]
  }
]

const enrichDialog = _dialog => {
  return _dialog.map(dialogStep => {
    return { dialogPartId: DIALOG_PART_ID, ...dialogStep }
  })
}

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

const Dialog = props => {
  console.log('dialog:')
  console.log({ props })
  const {
    actions,
    dialog: { currentDialogIndex }
  } = props

  const dialog = [
    {
      component: (
        <SpeakerLeft
          text='This game is targeted towards more experienced developer (developer in general, not
            Ethereum specific.'
        />
      )
    },
    {
      component: (
        <SpeakerRight
          text='This game is targeted towards more experienced developer (developer in general, not
            Ethereum specific.'
        />
      )
    }
  ]

  useEffect(() => {
    actions.dialog.initDialog({ dialogLength: dialog.length })
  }, [])

  return (
    <div id='newLevelDialog'>
      <div
        style={{
          float: 'left',
          width: '100%',
          marginTop: '15px'
        }}
      >
        {dialog.map((dialogPart, index) => {
          const isLastVisibleDialog = index === currentDialogIndex
          const isFinalDialog = index === dialog.length - 1

          console.log({ currentDialogIndex })
          if (index <= currentDialogIndex) {
            return dialogPart.component
          }
        })}
        <button
          type='button'
          className='nes-btn'
          id='continue'
          onClick={() => actions.dialog.continueDialog()}
          style={{ ...styles.button }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default Dialog
