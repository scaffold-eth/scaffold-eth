import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'

export const DIALOG_PART_ID = 'UnderflowBug/Start'

const _dialog = [
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>I'm in a bit of a pickle atm.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        As you might have guessed there aren't that many people left that can write in the language
        of old.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Not since you left anyway ...</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I found this guy a couple of months back that showed some promise.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Well you probably know where this is going. He built us a contract that we started using a
        while ago.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        It was going great at the beginning, but as it turned out, the moron made a rather silly
        mistake.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I not 100% sure, but as I understand it for some reason he limited the amount of tokens that
        we could mint from the contract.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        He mumbled something about a hostile majority? I don't know man, this is your domain.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        The thing is, we need to be able to issue more tokens. The current situation in the city
        demands it.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I would also like to know whether his concerns are valid… but we'll discuss that another
        time.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Can I ask you a favour? Could you take a look and let me know what you think? Maybe you can
        find a way how to we could issue more tokens?
      </SpeakerLeft>
    ),
    choices: ({ setContractWindowVisibility, setExplanationWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setContractWindowVisibility(true)
          setExplanationWindowVisibility(true)
        }}
      >
        Show Contract
      </Button>
    )
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Awesome!</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Im sure these will come in handy ...
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        I knew you still had it in you!
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Let's head into the city! I've arranged a meating with some of our friends.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Well ...</SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Maybe not friends ...</SpeakerLeft>
    ),
    choices: () => (
      <Link to={routesMap.CreateWallet.path}>
        <Button className='is-warning'>Drive into City</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
