import React, { useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import Dialog from './dialog'

const TemplateLevel = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    globalGameActions.background.setCurrentBackground({ background: 'City' })
  }, [])

  return (
    <div id='templateLevel'>
      <Terminal>
        <Dialog dialog={dialog} globalGameActions={globalGameActions} />
      </Terminal>
    </div>
  )
}

export default wrapGlobalGameData(TemplateLevel)
