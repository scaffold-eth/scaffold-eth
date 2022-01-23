import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background, QRPunkBlockie } from '../gameItems/components'

import TemplateLevel from './TemplateLevel'
import Intro from './Intro'
import UnderflowBug from './UnderflowBug'
import SetupLocalNetwork from './SetupLocalNetwork'
import CreateWallet from './CreateWallet'
import CityAtWar from './CityAtWar'

const Levels = ({ levelContainer: { currentLevel }, actions }) => {
  const setInitialLevel = levelId => {
    console.log(`setting initial level to: ${levelId}`)
    actions.level.setCurrentLevel({ levelId })
  }

  const [wallet, setWallet] = useState()

  const loadActiveLevel = () => {
    setInitialLevel('intro')
    // setInitialLevel('create-wallet')
  }

  useEffect(() => {
    loadActiveLevel()
  }, [])

  return (
    <>
      <Background />

      {wallet && wallet.address && (
        <div style={{ position: 'absolute', right: 100, top: -100, zIndex: 1 }}>
          <QRPunkBlockie withQr={false} address={wallet && wallet.address} scale={1} />
        </div>
      )}

      {currentLevel === 'template' && <TemplateLevel />}

      {currentLevel === 'intro' && <Intro />}
      {currentLevel === 'underflow-bug' && <UnderflowBug />}
      {currentLevel === 'setup-local-network' && <SetupLocalNetwork />}
      {currentLevel === 'create-wallet' && <CreateWallet />}
      {currentLevel === 'city-at-war' && <CityAtWar />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
