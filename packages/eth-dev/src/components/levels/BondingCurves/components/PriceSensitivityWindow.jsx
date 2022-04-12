import React from 'react'
import { WindowModal } from '../../../gameItems/components'

const PriceSensitivityWindow = ({ isOpen }) => {
  return (
    <WindowModal
      initTop={window.innerHeight * 0.1}
      initLeft={window.innerWidth / 2 + window.innerWidth * 0.02 + window.innerWidth * 0.05}
      initHeight={690}
      initWidth={710}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Price Sensitivity'
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
          src='./assets/levelSpecific/bondingCurves/price_sensitivity.png'
          alt='Price Sensitivity Bonding Curves'
        />
      </div>
    </WindowModal>
  )
}

export default PriceSensitivityWindow
