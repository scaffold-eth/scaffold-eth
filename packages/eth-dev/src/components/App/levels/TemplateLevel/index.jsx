import React, { useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import Dialog from './Dialog'

const TemplateLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'city' })
  }, [])

  return (
    <div id='templateLevel'>
      <Terminal>
        <Dialog dialog={dialog} actions={{ ...actions }} />
      </Terminal>
    </div>
  )
}

export default wrapGlobalGameData(TemplateLevel)
