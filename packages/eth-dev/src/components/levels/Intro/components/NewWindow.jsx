import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { WindowModal } from '../../../gameItems/components'

const NewWindow = ({ dialog, actions, isOpen }) => {
  return (
    <WindowModal
      initTop={60}
      initLeft={400}
      initHeight={300}
      initWidth={730}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '5%', paddingLeft: 20, paddingRight: 20 }}
    >
      Hello world
    </WindowModal>
  )
}

export default wrapGlobalGameData(NewWindow)
