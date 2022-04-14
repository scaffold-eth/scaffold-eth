import React from 'react'
import Typist from 'react-typist'

import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const InitChainInstructionsWindow = ({
  isOpen,
  continueDialog,
  setInitChainInstructionsWindowVisibility
}) => {
  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth / 2}
      initHeight={window.innerHeight * 0.8}
      initWidth={(window.innerWidth / 2) * 0.95}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='SETUP INSTRUCTIONS'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          By following the steps below, you will set up an Ethereum network on your local machine.
          <br />
          This will allow you to deploy smart contracts and execute transactions locally without
          having to spend real (expensive) Ether.
          <br />
          Apart from the transaction fees, there is no difference between your local Ethereum chain
          and the 'real' live Ethereum network.
          <br />
          If you wanted to, you could run all levels on the Ethereum main chain (or any other
          network that runs the EVM).
        </div>
        <CodeContainer language='bash'>
          {`# clone the eth-dev branch
$ git clone -b eth-dev https://github.com/austintgriffith/scaffold-eth.git eth-dev
$ cd eth-dev

# install dependencies
$ yarn

# start a local ethereum network
$ yarn chain

# in second terminal:
# deploys some smart contracts that we'll use throughout the game
$ yarn deploy`}
        </CodeContainer>

        {/*
        <div
          style={{
            padding: '10px 50px',
            color: '#16DC8C'
          }}
        >
          <Typist cursor={{ show: false }} avgTypingDelay={50} loop>
            Scanning for local network ...
          </Typist>
        </div>
        */}
        {/*
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            setInitChainInstructionsWindowVisibility(false)
          }}
        >
          Done
        </Button>
      */}
      </div>
    </WindowModal>
  )
}

export default InitChainInstructionsWindow
