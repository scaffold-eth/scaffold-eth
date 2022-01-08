import React, { useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import Dialog from './Dialog'

const IntroLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'city' })
  }, [])

  return (
    <div id='introLevel'>
      <Terminal>
        <Dialog dialog={dialog} actions={{ ...actions }} />
      </Terminal>
    </div>
  )
}

export default wrapGlobalGameData(IntroLevel)
