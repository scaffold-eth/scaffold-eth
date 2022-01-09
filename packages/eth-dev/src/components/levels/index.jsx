import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background, QRPunkBlockie } from '../gameItems/components'

import TemplateLevel from './TemplateLevel'
import Intro from './Intro'
import SetupLocalNetwork from './SetupLocalNetwork'
import CreateWallet from './CreateWallet'
import CityAtWar from './CityAtWar'

const Levels = ({ levelContainer: { currentLevel }, actions }) => {
  const setInitialLevel = levelId => {
    console.log('setting level to ' + levelId)
    actions.level.setCurrentLevel({ levelId })
  }

  const [wallet, setWallet] = useState()

  const loadActiveLevel = () => {
    setInitialLevel('intro')
    /*
    const generatedWallet = window.localStorage.getItem('mnemonic')
    if (!generatedWallet) {
      setInitialLevel('create-wallet')
    } else {
      // if they have an identity we send them on to the first level
      const newWallet = ethers.Wallet.fromMnemonic(generatedWallet)
      setWallet(newWallet)
      setInitialLevel('setup-local-network')
    }
    */
  }

  useEffect(() => {
    // window.localStorage.setItem('mnemonic', null)
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
      {currentLevel === 'setup-local-network' && <SetupLocalNetwork />}
      {currentLevel === 'create-wallet' && <CreateWallet />}
      {currentLevel === 'city-at-war' && <CityAtWar />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
