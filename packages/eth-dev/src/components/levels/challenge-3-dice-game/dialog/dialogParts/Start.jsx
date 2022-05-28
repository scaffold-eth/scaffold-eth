import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import { backgroundIds } from '../../../../gameItems/components/Background/backgroundsMap'

export const LEVEL_ID = 'Challenge3DiceGame'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        Wake up Kid! We stumbled across an opportunity and we need to move fast!
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        I've been tracking the Cryo Clan's funding and there has been a recent influx streaming from an underground dice contract.
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setBackgroundId }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setBackgroundId(backgroundIds.DiceGame)
          continueDialog()
        }}
      >
        Dice Game, huh?
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>Word on the street is their dice contract is insecure.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        We need you to find the vulnurabilities in the contract and strike.  Find a way to funnel that money back to us. 
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        I see that their DiceGame.sol contract is using the blockhash to create randomness.  Idiots...
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        The blockhash is predicatable.  Meaning we can guess the random number beforehand.  I want you to use this info the attack their DiceGame.sol contract using a contract of your own.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        My guys have written you some instructions to help you move fast on this.  Get me that money!
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setChallengeWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setChallengeWindowVisibility(true)
          continueDialog()
        }}
      >
        Get to it!
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        Great work!  The money is flowing back to us and the Cryo Clan is none the wiser!
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>
        Head back to the apartment and relax, you did good kid....
      </SpeakerLeft>
    ),
    choices: ({}) => (
      <Link to={routesMap.Challenge1DecentralizedStaking.path}>
        <Button className='is-warning'>Go to apartment</Button>
      </Link>
    )
  },
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
