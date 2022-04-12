import React from 'react'

import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const SelectLevelWindow = ({ isOpen }) => {
  const initWidth = 700
  const initHeight = initWidth

  const LEVELS_IDS = [
    'TemplateLevel',
    'Intro',
    'UnderflowBug',
    'SetupLocalNetwork',
    'CreateWallet',
    'SetupMetamask',
    'GamblingContract',
    'Multisig',
    'DecentralizedExchange',
    'NFTStore',
    'DAOHack',
    'FlashLoans'
  ]

  return (
    <WindowModal
      initTop={window.innerHeight * 0.1}
      initLeft={window.innerWidth * 0.1}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Decentralized Exchanges'
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
            fontSize: 16
          }}
        >
          <div style={{ color: 'white' }}>
            <p style={{ fontSize: 11, textAlign: 'center' }}>Levels</p>
            {/* TODO: need to update this to use <Link> */}
            {LEVELS_IDS.map(levelId => (
              <Button
                block
                // className='is-warning'
                // onClick={() => setCurrentLevel({ levelId })}
              >
                {levelId}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </WindowModal>
  )
}

export default SelectLevelWindow
