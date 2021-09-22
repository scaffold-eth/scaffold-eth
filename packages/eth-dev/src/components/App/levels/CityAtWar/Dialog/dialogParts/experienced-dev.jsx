import React from 'react'
import Typist from 'react-typist'
import { enrichDialog } from '../../../../gameItems/containers/dialog/helpers'
import { Button } from '../../../../gameItems/components'
import { SpeakerLeft } from '../components'

export const DIALOG_PATH_ID = 'setup-local-network/experienced-dev'

const dialog = [
  {
    component: ({ actions }) => (
      <SpeakerLeft
        text='Awesome, here are the specs........'
        pathToAvatar='./assets/punkatwar.png'
      />
    )
  },
]

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID)

export default enrichedDialog
