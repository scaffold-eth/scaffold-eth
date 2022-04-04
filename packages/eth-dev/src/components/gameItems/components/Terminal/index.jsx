import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './components'
import { WindowModal } from '..'

const Terminal = ({
  isOpen,
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

  console.log('in Terminal:')
  console.log({ isOpen })
  return (
    <WindowModal
      initTop={initTop || window.innerHeight - (initHeight + 10)}
      initLeft={initLeft || 0}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/terminal_medium.png'
      // backgroundPath='./assets/items/terminal_big.png'
      dragAreaHeightPercent={30}
      isOpen={isOpen}
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
