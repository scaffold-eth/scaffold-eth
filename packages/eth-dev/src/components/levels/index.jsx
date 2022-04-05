import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background, QRPunkBlockie } from '../gameItems/components'

import TemplateLevel from './TemplateLevel'
import Intro from './Intro'

import Challenge0SimpleNFT from './challenge-0-simple-nft'
import Challenge1DecentralizedStaking from './challenge-1-decentralized-staking'
import Challenge2TokenVendor from './challenge-2-token-vendor'
import Challenge3Dex from './challenge-3-dex'
import Challenge5MultiSig from './challenge-5-multi-sig'

import ScaffoldEthOverview from './ScaffoldEthOverview'
import UnderflowBug from './UnderflowBug'
import SetupLocalNetwork from './SetupLocalNetwork'
import CreateWallet from './CreateWallet'
import SetupMetamask from './SetupMetamask'
import GamblingContract from './GamblingContract'

import DAOHack from './DAOHack'
import FlashLoans from './FlashLoans'
import ERC20 from './ERC20'
import BondingCurves from './BondingCurves'
import ENS from './ENS'
import UpgradableContracts from './UpgradableContracts'

import NotFound from './NotFound'

const Levels = ({ levelContainer: { currentLevel }, globalGameActions, loadWeb3Modal }) => {
  // TODO:
  /*
  const setInitialLevel = levelId => {
    console.log(`setting initial level to: ${levelId}`)
    globalGameActions.level.setCurrentLevel({ levelId })
  }
  */

  // TODO:
  const [wallet, setWallet] = useState()

  return (
    <>
      <Background />

      {wallet && wallet.address && (
        <div style={{ position: 'absolute', right: 100, top: -100, zIndex: 1 }}>
          <QRPunkBlockie withQr={false} address={wallet && wallet.address} scale={1} />
        </div>
      )}

      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <Intro />
          </Route>
          <Route path='/challenge-0-simple-nft'>
            <Challenge0SimpleNFT />
          </Route>
          <Route path='/challenge-1-decentralized-staking'>
            <Challenge1DecentralizedStaking />
          </Route>
          <Route path='/challenge-2-token-vendor'>
            <Challenge2TokenVendor />
          </Route>
          <Route path='/challenge-3-dex'>
            <Challenge3Dex />
          </Route>
          <Route path='/challenge-5-multi-sig'>
            <Challenge5MultiSig />
          </Route>
          <Route path='/scaffold-eth-overview'>
            <ScaffoldEthOverview />
          </Route>
          <Route path='/underflow-bug'>
            <UnderflowBug />
          </Route>
          <Route path='/setup-local-network'>
            <SetupLocalNetwork />
          </Route>
          <Route path='/create-wallet'>
            <CreateWallet />
          </Route>
          <Route path='/setup-metamask'>
            <SetupMetamask />
          </Route>
          <Route path='/insecure-gambling-contract'>
            <GamblingContract />
          </Route>

          <Route path='/dao-hack'>
            <DAOHack />
          </Route>
          <Route path='/flash-loans'>
            <FlashLoans />
          </Route>
          <Route path='/erc20'>
            <ERC20 />
          </Route>
          <Route path='/bonding-curves'>
            <BondingCurves />
          </Route>
          <Route path='/ens'>
            <ENS />
          </Route>
          <Route path='/upgradable-contracts'>
            <UpgradableContracts />
          </Route>

          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default wrapGlobalGameData(Levels)
