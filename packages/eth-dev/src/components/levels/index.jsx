import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background, QRPunkBlockie } from '../gameItems/components'

import TemplateLevel from './TemplateLevel'
import Intro from './Intro'
import UnderflowBug from './UnderflowBug'
import SetupLocalNetwork from './SetupLocalNetwork'
import CreateWallet from './CreateWallet'
import SetupMetamask from './SetupMetamask'
import GamblingContract from './GamblingContract'
import Multisig from './Multisig'
import DecentralizedExchange from './DecentralizedExchange'
import NFTStore from './NFTStore'
import DAOHack from './DAOHack'
import FlashLoans from './FlashLoans'

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
      {currentLevel === 'SetupMetamask' && <SetupMetamask />}
      {currentLevel === 'GamblingContract' && <GamblingContract />}
      {currentLevel === 'Multisig' && <Multisig />}
      {currentLevel === 'DecentralizedExchange' && <DecentralizedExchange />}
      {currentLevel === 'NFTStore' && <NFTStore />}
      {currentLevel === 'DAOHack' && <DAOHack />}
      {currentLevel === 'FlashLoans' && <FlashLoans />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
