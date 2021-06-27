import React from 'react'
import { SpeakerLeft, SpeakerRight } from '../components'
import { enrichDialog } from '../helpers'
import { CodeContainer } from '../../../gameItems/components'

export const DIALOG_PATH_ID = 'intro/experienced-dev'

const dialog = [
  {
    component: ({ actions }) => (
      <>
        <SpeakerLeft text={`Cool! For the game to run smoothly you'll need to do the following:`} />
        <CodeContainer language='bash'>
          {`
            # clone the eth-dev branch
            $ git clone -b eth-dev https://github.com/austintgriffith/scaffold-eth.git eth-dev
            $ cd eth-dev
            # start a local ethereum blockchain
            $ yarn chain
            # in second terminal:
            # deploys some smart contracts that will be used throughout the game
            $ yarn deploy
          `}
        </CodeContainer>
      </>
    )
  }
]

const alternativeDialogBranches = ['intro/beginner-dev']

const enrichedDialog = enrichDialog(dialog, DIALOG_PATH_ID, alternativeDialogBranches)

export default enrichedDialog
