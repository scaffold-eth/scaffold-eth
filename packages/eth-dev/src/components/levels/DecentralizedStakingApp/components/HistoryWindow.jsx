import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const HistoryWindow = ({
  isOpen,
  globalGameActions,
  setHistoryWindowVisibility,
  setContractWindowVisibility,
  setChallengeWindowVisibility
}) => {
  return (
    <WindowModal
      initTop={20}
      initLeft={window.innerWidth * 0.1}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Staking'
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
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        />

        <Button
          className='is-warning'
          onClick={() => {
            setHistoryWindowVisibility(false)
            setContractWindowVisibility(false)
            setChallengeWindowVisibility(true)
          }}
        >
          Start Challenge
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(HistoryWindow)
