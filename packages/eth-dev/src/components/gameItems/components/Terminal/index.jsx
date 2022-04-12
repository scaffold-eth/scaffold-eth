import React, { useState, useEffect } from 'react'
import { WindowModal, UnreadMessagesNotification } from '..'

const Terminal = ({
  isOpen,
  initTop,
  initLeft,
  backgroundPath,
  showMessageNotification = {},
  showTerminal,
  children
}) => {
  const initHeight = 800
  const initWidth = initHeight * 0.65

  const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000))

  const [_showMessageNotification, setShowMessageNotification] = useState(false)

  useEffect(() => {
    async function exec() {
      if (showMessageNotification && showMessageNotification.delayInSeconds) {
        console.log(`now waiting ${showMessageNotification.delayInSeconds} seconds`)
        await sleep(showMessageNotification.delayInSeconds)
        console.log('now show notification')
        setShowMessageNotification(true)
      }
    }
    exec()
  }, [showMessageNotification.delayInSeconds])

  useEffect(() => {
    setShowMessageNotification(false)
  }, [isOpen])

  return (
    <>
      {_showMessageNotification && <UnreadMessagesNotification showTerminal={showTerminal} />}

      <WindowModal
        initTop={initTop || window.innerHeight - (initHeight + window.innerHeight * 0.05)}
        initLeft={initLeft || window.innerWidth * 0.05}
        initHeight={initHeight}
        initWidth={initWidth}
        backgroundPath={backgroundPath || './assets/items/terminal_medium.png'}
        // backgroundPath='./assets/items/terminal_big.png'
        dragAreaHeightPercent={30}
        isOpen={isOpen}
      >
        {children}
      </WindowModal>
    </>
  )
}

export default Terminal
