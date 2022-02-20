import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './components'
import { WindowModal } from '..'

const Terminal = ({
  isVisible,
  levelContainer: { currentLevel },
  dialog,
  actions,
  globalGameActions,
  initTop,
  initLeft,
  ...props
}) => {
  const initHeight = 800
  const initWidth = initHeight * 0.65

  return (
    <WindowModal
      initTop={initTop || window.innerHeight - (initHeight + 10)}
      initLeft={initLeft || 0}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/terminal.png'
      dragAreaHeightPercent={32}
      isOpen={isVisible}
    >
      <DialogContainer
        currentLevel={currentLevel}
        dialog={dialog}
        actions={actions}
        globalGameActions={globalGameActions}
        parentProps={{ ...props }}
      />
    </WindowModal>
  )
}

export default connectController(Terminal)
