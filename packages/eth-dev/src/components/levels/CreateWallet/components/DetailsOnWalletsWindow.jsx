import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const DetailsOnWalletsWindow = ({ dialog, actions, isOpen }) => {
  const initWidth = window.innerWidth / 2
  const initHeight = window.innerHeight * 0.95

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='WALLETS'
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
        <br />
        The ethereum.org website has some fantastic guides on what Ethereum wallets are: <br />
        <br />
        {'->'}{' '}
        <a href='https://ethereum.org/en/wallets/' target='_blank' rel='noreferrer'>
          Visit ethereum.org/en/wallets
        </a>
        <br />
        <br />
        {'->'}{' '}
        <a
          href='https://medium.com/building-blocks-on-the-chain/how-to-build-a-react-dapp-with-hardhat-and-metamask-9cec8f6410d3#7c9f'
          target='_blank'
          rel='noreferrer'
        >
          Setup Metamask
        </a>
        <br />
        <br />
        <Button onClick={() => console.log('click')}>Continue</Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(DetailsOnWalletsWindow)
