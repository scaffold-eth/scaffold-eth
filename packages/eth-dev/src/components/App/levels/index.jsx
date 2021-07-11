import React from 'react'

import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background } from '../gameItems/components'

import TemplateLevel from './TemplateLevel'
import SetupLocalNetwork from './SetupLocalNetwork'
import CreateWallet from './CreateWallet'

const Levels = ({ levelContainer: { currentLevel } }) => {
  return (
    <>
      <Background />

      {currentLevel === 'template' && <TemplateLevel />}
      {currentLevel === 'setup-local-network' && <SetupLocalNetwork />}
      {currentLevel === 'create-wallet' && <CreateWallet />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
