import React from 'react'

import { WindowModal } from '../gameItems/components'

const ProgressTrackerWindow = ({ isOpen }) => {
  const initHeight = window.innerHeight * 0.9
  const initWidth = window.innerWidth * 0.5

  const styles = {
    float: 'left',
    width: '100%',
    padding: 5,
    backgroundColor: '#ccc'
  }
  return (
    <WindowModal
      // place window in center of screen
      initTop={window.innerHeight / 2 - initHeight / 2}
      initLeft={window.innerWidth / 2 - initWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Progress Tracker'
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
          overflowX: 'hidden',
          fontSize: '12px',
          lineHeight: '25px'
        }}
      >
        <div style={{ ...styles }}>
          <h1 style={{ float: 'left', fontSize: 14 }}>Solidity Basics</h1>
          <p style={{ float: 'right' }}>Progress: 4/10</p>
        </div>
        <div style={{ ...styles }}>
          <p style={{ fontSize: 14 }}>Advanced Solidity Concepts</p>
          <p style={{ float: 'right' }}>4/10</p>
        </div>
        <div style={{ ...styles }}>
          <p style={{ fontSize: 14 }}>Assembly</p>
        </div>
        <div style={{ ...styles }}>
          <h1 style={{ fontSize: 14 }}>Full Stack Development</h1>
        </div>
        <div style={{ ...styles }}>
          <h1 style={{ fontSize: 14 }}>DEFI</h1>
        </div>
        <div style={{ ...styles }}>
          <h1 style={{ fontSize: 14 }}>Smart Contract Security</h1>
        </div>
        <div style={{ ...styles }}>
          <h1 style={{ fontSize: 14 }}>Tokenomics</h1>
        </div>
      </div>
    </WindowModal>
  )
}

export default ProgressTrackerWindow
