import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { WindowModal, MonologWindow, Terminal, Button } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { NewWindow, WelcomeWindow, IncomingCallBubble } from './components'
import dialogArray from './dialog/dialogArray'

const IntroLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set background
    actions.background.setCurrentBackground({ background: 'intro' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'intro/start-monolog',
      currentDialog: dialogArray
    })
  }, [])

  const [didEnterGame, setDidEnterGame] = useState(false)
  const enterGame = () => setDidEnterGame(true)

  const [didFinishMonolog, setDidFinishMonolog] = useState(false)
  const finishMonolog = () => setDidFinishMonolog(true)

  const [didPickUpCall, setDidPickUpCall] = useState(false)
  const pickUpCall = () => setDidPickUpCall(true)

  const removeMonologFromDialog = _dialogArray => {
    const dialogWithoutMonolog = _dialogArray.filter(
      part => part.dialogPathId !== 'intro/start-monolog'
    )
    return dialogWithoutMonolog
  }

  useEffect(() => {
    if (didFinishMonolog) {
      actions.dialog.initDialog({
        initialDialogPathId: 'intro/first-contact',
        currentDialog: removeMonologFromDialog(dialogArray)
      })
    }
  }, [didFinishMonolog])

  const markdown = `
# Ethernaut

<p>Ethernaut is a Web3/Solidity based wargame inspired in <a href="https://overthewire.org" target="_blank" rel="noopener noreferrer">overthewire.org</a>, to be played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>

The game acts both as a tool for those interested in learning ethereum, and as a way to catalogue historical hacks in levels. Levels can be infinite and the game does not require to be played in any particular order.

*Level PR's are welcome!*

### Deployed Versions

You can find the current, official version at:
[ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com)

### Running locally (local network)

1. Install
~~~
git clone git@github.com:OpenZeppelin/ethernaut.git
yarn install
~~~
2. Start deterministic rpc
~~~
yarn network
~~~
3. You might want to import one of the private keys from ganache-cli to your Metamask wallet.
4. Compile contracts
~~~
yarn compile:contracts
~~~
5. Set client/src/constants.js ACTIVE_NETWORK to NETWORKS.LOCAL
6. Deploy contracts
~~~
yarn deploy:contracts
~~~
7. Start Ethernaut locally
~~~
yarn start:ethernaut
~~~

### Running locally (ropsten network)

The same as using the local network but steps 2, 3 and 6 are not necessary.

In this case, replace point 5 with:
5. Set client/src/constants.js ACTIVE_NETWORK to NETWORKS.ROPSTEN

### Running tests

~~~
yarn test:contracts
~~~

### Building

Let's suppose that we are creating the level "King" (which is already created and available in the game of course).

1. Fork this repo, clone and npm install.
2. Use the other levels as a basis, eg. duplicate DummyFactory.sol and Dummy.sol.
3. Rename and modify the contracts to KingFactory.sol and King.sol.
4. Implement the desired instance and factory logic in solidity. See current levels and notes to understand how the game mechanics work.
5. Add contracts/test/levels/King.test.js file. Use other tests files as reference to see how tests might work.
7. The level should now show up in the ui. To start the UI, set client/src/constants.js' ACTIVE_NETWORK to DEVELOPMENT and run npm start.
8. Add a description markdown file, in this case client/src/gamedata/levels/king.md (make sure gamedata.json points to it). This content will now be displayed in the ui for the level.
9. Verify that the level is playable and winnable via UI. It is common for levels to be beatable in some way in tests that doesn't work using the UI, so it is important to test it manually as well.
10. Add a completed description markdown file, in this case client/src/gamedata/levels/king_complete.md (make sure gamedata.json points to it). The level will display this as additional info once the level is solved, usually to include historical information related to the level.
11. Make a PR request so that we can re-deploy the game with the new level!

### Build

~~~
 yarn build:ethernaut
~~~

### Deployment

To deploy the contracts on ropsten, first set the ACTIVE_NETWORK variable in constants.js and then edit gamedata.json. This file keeps a history of all level instances in each level data's deployed_ropsten array. To deploy a new instance, add an "x" entry to the array, like so:

~~~
"deployed_ropsten": [
  "x",
  "0x4b1d5eb6cd2849c7890bcacd63a6855d1c0e79d5",
  "0xdf51a9e8ce57e7787e4a27dd19880fd7106b9a5c"
],
~~~
`

  const initWidth = window.innerWidth / 2
  const initHeight = initWidth

  return (
    <div id='introLevel'>
      <WindowModal
        initTop={0}
        initLeft={0}
        initHeight={initHeight}
        initWidth={initWidth}
        backgroundPath='./assets/trimmed/window_trimmed.png'
        dragAreaHeightPercent={12}
        isOpen
        contentContainerStyle={{}}
      >
        <div
          className='windowTitle'
          style={{
            position: 'absolute',
            top: '7.3%',
            left: '54%',
            width: '31%',
            height: '3%',
            fontSize: '61%',
            color: '#16DC8C'
          }}
        >
          INSTRUCTIONS
        </div>
        <ReactMarkdown>{markdown}</ReactMarkdown>
        <Button>Continue</Button>
      </WindowModal>

      {!didEnterGame && <WelcomeWindow isOpen enterGame={enterGame} />}

      {didEnterGame && !didFinishMonolog && (
        <MonologWindow
          isOpen={!didFinishMonolog}
          globalGameActions={actions}
          finishMonolog={finishMonolog}
        />
      )}

      {didFinishMonolog && !didPickUpCall && (
        <IncomingCallBubble actions={actions} pickUpCall={pickUpCall} />
      )}

      {didEnterGame && didFinishMonolog && didPickUpCall && (
        <Terminal isOpen globalGameActions={actions} />
      )}
    </div>
  )
}

export default wrapGlobalGameData(IntroLevel)
