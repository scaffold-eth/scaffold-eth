import React from 'react'

import { WindowModal } from '../gameItems/components'

const ProgressTrackerWindow = ({ isOpen }) => {
  const initHeight = 600
  const initWidth = 600

  const progresSstyles = {
    color: '#fff'
  }
  return (
    <WindowModal
      initTop={40}
      initLeft={window.innerWidth - (initWidth + 40)}
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
          fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
          fontSize: 16,
          lineHeight: '25px',
          color: '#16DC8C'
        }}
      >
        <table style={{ width: '100%', tableLayout: 'fixed', overflowWrap: 'break-word' }}>
          <tr>
            <th>Topic</th>
            <th>Progress</th>
          </tr>
          <tr>
            <td>Advanced Solidity Concepts</td>
            <td style={{ ...progresSstyles }}>4/10</td>
          </tr>
          <tr>
            <td>Assembly</td>
            <td style={{ ...progresSstyles }}>4/10</td>
          </tr>
          <tr>
            <td>Full Stack Development</td>
            <td style={{ ...progresSstyles }}>4/10</td>
          </tr>
          <tr>
            <td>DEFI</td>
            <td style={{ ...progresSstyles }}>4/10</td>
          </tr>
          <tr>
            <td>Smart Contract Security</td>
            <td style={{ ...progresSstyles }}>4/10</td>
          </tr>
          <tr>
            <td>Tokenomics</td>
            <td style={{ ...progresSstyles }}>4/10</td>
          </tr>
        </table>
      </div>
    </WindowModal>
  )
}

export default ProgressTrackerWindow
