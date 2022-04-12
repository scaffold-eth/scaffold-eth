import React from 'react'
import { DialogContainer } from './components'
import { WindowModal } from '..'

const MonologWindow = ({
  isOpen,
  dialog,
  children,
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
      isOpen={isOpen}
      style={{ backgroundColor: 'rgb(25, 218, 252, 0.2)' }}
    >
      {children}
    </WindowModal>
  )
}

export default MonologWindow
