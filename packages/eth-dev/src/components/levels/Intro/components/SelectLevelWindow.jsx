import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, WindowModal } from '../../../gameItems/components'

const SelectLevelWindow = ({ actions, isOpen }) => {
  return (
    <WindowModal
      initTop={50}
      initLeft={0}
      initHeight={250}
      initWidth={312}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '20%', paddingLeft: 20, paddingRight: 20 }}
    >
      <div style={{ color: 'white' }}>
        <p style={{ fontSize: 11, textAlign: 'center' }}>Levels</p>
        <Button block onClick={() => actions.level.setCurrentLevel({ levelId: 'UnderflowBug' })}>
          UnderflowBug
        </Button>
        <Button
          block
          onClick={() => actions.level.setCurrentLevel({ levelId: 'SetupLocalNetwork' })}
        >
          SetupLocalNetwork
        </Button>
        <Button block onClick={() => actions.level.setCurrentLevel({ levelId: 'CreateWallet' })}>
          CreateWallet
        </Button>
        <Button block onClick={() => actions.level.setCurrentLevel({ levelId: 'CityAtWar' })}>
          CityAtWar
        </Button>
        <Button
          block
          onClick={() => actions.level.setCurrentLevel({ levelId: 'ConnectToMetamask' })}
        >
          ConnectToMetamask
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(SelectLevelWindow)
