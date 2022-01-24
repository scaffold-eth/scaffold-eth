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
import ConnectToMetamask from './ConnectToMetamask'

const Levels = ({ levelContainer: { currentLevel }, globalGameActions }) => {
  const setInitialLevel = levelId => {
    console.log(`setting initial level to: ${levelId}`)
    globalGameActions.level.setCurrentLevel({ levelId })
  }

  // TODO:
  const [wallet, setWallet] = useState()

  const setupGame = () => {
    setInitialLevel('Intro')
  }

  useEffect(() => {
    setupGame()
  }, [])

  return (
    <>
      <Background />

      {wallet && wallet.address && (
        <div style={{ position: 'absolute', right: 100, top: -100, zIndex: 1 }}>
          <QRPunkBlockie withQr={false} address={wallet && wallet.address} scale={1} />
        </div>
      )}

      {currentLevel === 'TemplateLevel' && <TemplateLevel />}

      {currentLevel === 'Intro' && <Intro />}
      {currentLevel === 'UnderflowBug' && <UnderflowBug />}
      {currentLevel === 'SetupLocalNetwork' && <SetupLocalNetwork />}
      {currentLevel === 'CreateWallet' && <CreateWallet />}
      {currentLevel === 'CityAtWar' && <CityAtWar />}
      {currentLevel === 'ConnectToMetamask' && <ConnectToMetamask />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
