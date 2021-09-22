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

  useEffect(() => {
    const generatedWallet = window.localStorage.getItem("mnemonic");
    try{
      const newWallet = ethers.Wallet.fromMnemonic(generatedWallet)
      setWallet(newWallet)
      //if they have an identity we send them on to the first level ....
      if(generatedWallet){
        setInitialLevel('CityAtWar')
      }else{
        setInitialLevel('setup-local-network')
      }
    }catch(e){
      setInitialLevel('setup-local-network')
    }
  }, [])

  const [wallet, setWallet] = useState()

  return (
    <>
      <Background />

      {wallet && wallet.address ?<div style={{position:"absolute",right:100,top:-100,zIndex:1}} onClick={()=>{
        console.log("this is just a quick hack to clear the identity while testing onboarding...")
        window.localStorage.setItem("mnemonic",false)
        window.location.reload();
        return false;
      }}>
        <QRPunkBlockie withQr={false} address={wallet && wallet.address} scale={1} />
      </div>:""}

      {currentLevel === 'template' && <TemplateLevel />}
      {currentLevel === 'setup-local-network' && <SetupLocalNetwork />}
      {currentLevel === 'create-wallet' && <CreateWallet />}
      {currentLevel === 'CityAtWar' && <CityAtWar />}
    </>
  )
}

export default wrapGlobalGameData(Levels)
