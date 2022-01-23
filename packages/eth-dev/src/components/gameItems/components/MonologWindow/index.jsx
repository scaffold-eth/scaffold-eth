import React from 'react'
import { connectController } from './controller'
import { DialogContainer } from './components'
import { WindowModal } from '..'

const MonologWindow = ({
  isVisible,
  levelContainer: { currentLevel },
  dialog,
  actions,
  globalGameActions,
  ...props
}) => {
  const initHeight = 250
  const initWidth = 450

  return (
    <WindowModal
      initTop={0}
      initLeft={window.innerWidth - initWidth}
      initHeight={initHeight}
      initWidth={initWidth}
      // backgroundPath=''
      dragAreaHeightPercent={5}
      isOpen={isVisible}
      style={{ backgroundColor: 'rgb(25, 218, 252, 0.2)' }}
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

export default connectController(MonologWindow)
