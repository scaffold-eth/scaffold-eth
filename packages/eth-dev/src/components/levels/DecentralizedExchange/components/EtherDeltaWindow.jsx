import React from 'react'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { WindowModal } from '../../../gameItems/components'

const EtherDeltaWindow = ({ isOpen }) => {
  return (
    <WindowModal
      initTop={window.innerHeight * 0.1}
      initLeft={window.innerWidth / 2 + window.innerWidth * 0.02 + window.innerWidth * 0.05}
      initHeight={510}
      initWidth={900}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Ether Delta'
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
        <img src='https://i.imgur.com/VqGivni.jpeg' alt='Ether Delta' />
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(EtherDeltaWindow)
