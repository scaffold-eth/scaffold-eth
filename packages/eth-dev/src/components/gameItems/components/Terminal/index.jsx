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
  ...props
}) => {
  const initHeight = 700
  const initWidth = 450

  return (
    <WindowModal
      initTop={window.innerHeight - (initHeight + 10)}
      initLeft={0}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/trimmed/terminal_trimmed.png'
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
