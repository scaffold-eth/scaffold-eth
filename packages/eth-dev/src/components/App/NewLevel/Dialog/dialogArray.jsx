import React from 'react'
import { SpeakerLeft, SpeakerRight } from './components'

// eslint-disable-next-line no-underscore-dangle
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

export default [
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
