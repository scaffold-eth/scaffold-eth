import React from 'react'
import { WindowModal } from '../../../gameItems/components'

const WhatIsABondingCurveWindow = ({ isOpen }) => {
  return (
    <WindowModal
      initTop={window.innerHeight * 0.1}
      initLeft={window.innerWidth / 2 + window.innerWidth * 0.02 + window.innerWidth * 0.05}
      initHeight={200}
      initWidth={300}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Bonding Curvesy'
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
        <img
          src='./assets/levelSpecific/bondingCurves/what_is_bonding_curve.png'
          alt='What is a Bonding Curves'
        />
      </div>
    </WindowModal>
  )
}

export default WhatIsABondingCurveWindow
