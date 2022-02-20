import React, { useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import Dialog from './dialog'

export const LEVEL_ID = 'TemplateLevel'

const TemplateLevel = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // init level
    globalGameActions.level.setCurrentLevel({ levelId: LEVEL_ID })
    // set initial level background
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
