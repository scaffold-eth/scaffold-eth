import React from 'react'
import { Link } from 'react-router-dom'

import { routesMap } from '../../../../../routes'
import { enrichDialog } from '../../../../../helpers'
import { SpeakerLeft, SpeakerRight, Button } from '../../../../gameItems/components'
import { backgroundIds } from '../../../../gameItems/components/Background/backgroundsMap'

export const LEVEL_ID = 'ExampleLevel'
export const DIALOG_PART_ID = `${LEVEL_ID}/Start`

const _dialog = [
  {
    dialog: ({ isLastVisibleDialog }) => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        This is an example of dialog with no choices.  The user must click Continue to move to the next dialog.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>You can edit the pathToAvatar to change which avatar icon appears.  These files are found in eth-dev/build/assets.</SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Here we display a button to the user along with an example of how to change the image in the background.  The background images are in eth-dev/build/assets/backgrounds and the backgroundIds are in packages\eth-dev\src\components\gameItems\components\Background\backgroundsMap.jsx
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setBackgroundId }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setBackgroundId(backgroundIds.RoofSatellite)
          continueDialog()
        }}
      >
        Change Background Image
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punkatwar.png'>The avatar and backgrounds can be changed during any dialog.  Let's switch up this message to show communication between multiple punks. </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerRight pathToAvatar='./assets/punk5950.png'>
       You can use SpeakerRight to mimic communication as the user's player.
      </SpeakerRight>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        This level only has one .jsx file in the dialogParts folder.  Look at the CreateWallet level dialogParts for an example of how to deal with multiple files and how they interact.
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Let's open a pop-up example window! ExampleWindow.jsx exists in /components/, but search ExampleWindow in your level's directory to see all the instances that need updated/inserted to create a new window.
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setExampleWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setExampleWindowVisibility(true)
          continueDialog()
        }}
      >
        Pop Up The Window!
      </Button>
    )
  },
  {
    dialog: () => <></>,
    choices: () => <></>
  },
  {
  dialog: () => (
    <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
      You can also display a Github Read Me.  Let's use the getChallengeReadme helper to open a tutorial from SpeedRunEthereum.com
          </SpeakerLeft>
  ),
  choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'> You will need to click Continue on each step of the new window to continue the dialog. </SpeakerLeft>,
    choices: ({ setGithubWindowVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setGithubWindowVisibility(true)
          //continueDialog()
        }}
      >
      Open Github Page
      </Button>
    )
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
      Note in the Github example you have to use raw.githubusercontent.com in order to display it correctly. 
      </SpeakerLeft>
    ),
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
    There are a variety of pop up models you can open in your level.  Check them out at eth-dev/build/assets/items. 
    </SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
    To make a new window, you can copy the ExampleWindow.jsx into a new file.  Then update the backgroundPath to whatever window you want.
    </SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
   You will also need to update index.jsx for every window you add.
    </SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
    Start by importing your new file, then add a const and new instance of your file, and finally add your window to the TerminalDialogContainer.
    </SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
    Next edit the index.js file to include your window.
    </SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
        Now you can make the window visible using setExampleTerminalVisibility(true) in the dialog.
      </SpeakerLeft>
    ),
    choices: ({ continueDialog, setExampleTerminalVisibility }) => (
      <Button
        className='is-warning'
        onClick={() => {
          setExampleTerminalVisibility(true)
          continueDialog()
        }}
      >
      Open Example Terminal
      </Button>
    )
  },
  {
    dialog: () => <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>
    Note the code in the WindowModal of ExampleWindow.jsx.  This controls the size, starting position, title, draggable area, and more of the window.
    </SpeakerLeft>,
    choices: null
  },
  {
    dialog: () => (
      <SpeakerLeft pathToAvatar='./assets/punk_anon.png'>Check out packages\eth-dev\src\components\gameItems\components for more cool things to import and play with!</SpeakerLeft>
    ),
    choices: ({}) => (
      <Link to={routesMap.Challenge1DecentralizedStaking.path}>
        <Button className='is-warning'>Go to apartment</Button>
      </Link>
    )
  }
]

const enrichedDialog = enrichDialog(_dialog, DIALOG_PART_ID)

export default enrichedDialog
