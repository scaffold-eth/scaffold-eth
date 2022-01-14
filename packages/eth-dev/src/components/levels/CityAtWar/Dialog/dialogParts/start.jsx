import React from 'react'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft, SpeakerRight } from '../components'

export const DIALOG_PATH_ID = 'city-at-war/start'

const _dialog = [
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft pathToAvatar='./assets/punkatwar.png' text='The city is at war, Anon.' />
      ),
      choices: null
    }
  },
  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punkatwar.png'
          text='The *baronesses* of each warring faction are dedicating larger amounts of their spending on **brawling**.'
        />
      ),
      choices: null
    }
  },

  {
    components: {
      dialog: ({ dialog: { currentDialog }, isLastVisibleDialog, globalGameActions }) => (
        <SpeakerLeft
          pathToAvatar='./assets/punkatwar.png'
          text='We need to write a **smart contract** that allows each *baroness* to stake part of their treasury towards a coordinated effort.'
        />
      ),
      choices: null
    }
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PATH_ID, [])

export default enrichedDialog
