import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background, QRPunkBlockie } from '../gameItems/components'

import TemplateLevel from './TemplateLevel'
import SetupLocalNetwork from './SetupLocalNetwork'
import CreateWallet from './CreateWallet'
import CityAtWar from './CityAtWar'

const Levels = ({ levelContainer: { currentLevel }, actions }) => {
  const setInitialLevel = levelId => {
    actions.level.setCurrentLevel({ levelId })
  }

  const [wallet, setWallet] = useState()

  const loadActiveLevel = () => {
    const generatedWallet = window.localStorage.getItem('mnemonic')
    if (!generatedWallet) {
      console.log('in if !generatedWallet')
      setInitialLevel('create-wallet')
    } else {
      // if they have an identity we send them on to the first level
      console.log('in generatedWallet')
      const newWallet = ethers.Wallet.fromMnemonic(generatedWallet)
      console.log({ newWallet })
      setWallet(newWallet)
      console.log('now setup local network')
      setInitialLevel('setup-local-network')
    }
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
      {currentLevel === 'setup-local-network' && <SetupLocalNetwork />}
      {currentLevel === 'create-wallet' && <CreateWallet />}
      {currentLevel === 'city-at-war' && <CityAtWar />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
