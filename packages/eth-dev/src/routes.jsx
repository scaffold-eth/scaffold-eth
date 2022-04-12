import React from 'react'

import Intro from './components/levels/Intro'
import Challenge0SimpleNFT from './components/levels/challenge-0-simple-nft'
import Challenge1DecentralizedStaking from './components/levels/challenge-1-decentralized-staking'
import Challenge2TokenVendor from './components/levels/challenge-2-token-vendor'
import Challenge3Dex from './components/levels/challenge-3-dex'
import Challenge5MultiSig from './components/levels/challenge-5-multi-sig'

import ScaffoldEthOverview from './components/levels/ScaffoldEthOverview'
import UnderflowBug from './components/levels/UnderflowBug'
import SetupLocalNetwork from './components/levels/SetupLocalNetwork'
import CreateWallet from './components/levels/CreateWallet'
import SetupMetamask from './components/levels/SetupMetamask'
import GamblingContract from './components/levels/GamblingContract'
import GnosisSafe from './components/levels/GnosisSafe'

import DAOHack from './components/levels/DAOHack'
import FlashLoans from './components/levels/FlashLoans'
import ERC20 from './components/levels/ERC20'
import BondingCurves from './components/levels/BondingCurves'
import ENS from './components/levels/ENS'
import UpgradableContracts from './components/levels/UpgradableContracts'

export const routesList = [
  {
    name: 'Intro',
    path: '/',
    component: <Intro />
  },
  {
    name: 'Challenge0SimpleNFT',
    path: '/challenge-0-simple-nft',
    component: <Challenge0SimpleNFT />
  },
  {
    name: 'Challenge1DecentralizedStaking',
    path: '/challenge-1-decentralized-staking',
    component: <Challenge1DecentralizedStaking />
  },
  {
    name: 'Challenge2TokenVendor',
    path: '/challenge-2-token-vendor',
    component: <Challenge2TokenVendor />
  },
  {
    name: 'Challenge3Dex',
    path: '/challenge-3-dex',
    component: <Challenge3Dex />
  },
  {
    name: 'Challenge5MultiSig',
    path: '/challenge-5-multi-sig',
    component: <Challenge5MultiSig />
  },
  {
    name: 'ScaffoldEthOverview',
    path: '/scaffold-eth-overview',
    component: <ScaffoldEthOverview />
  },
  {
    name: 'UnderflowBug',
    path: '/underflow-bug',
    component: <UnderflowBug />
  },
  {
    name: 'SetupLocalNetwork',
    path: '/setup-local-network',
    component: <SetupLocalNetwork />
  },
  {
    name: 'CreateWallet',
    path: '/create-wallet',
    component: <CreateWallet />
  },
  {
    name: 'SetupMetamask',
    path: '/setup-metamask',
    component: <SetupMetamask />
  },
  {
    name: 'GamblingContract',
    path: '/gambling-contract',
    component: <GamblingContract />
  },
  {
    name: 'DAOHack',
    path: '/dao-hack',
    component: <DAOHack />
  },
  {
    name: 'FlashLoans',
    path: '/flash-loans',
    component: <FlashLoans />
  },
  {
    name: 'ERC20',
    path: '/erc20',
    component: <ERC20 />
  },
  {
    name: 'BondingCurves',
    path: '/bonding-curves',
    component: <BondingCurves />
  },
  {
    name: 'ENS',
    path: '/ens',
    component: <ENS />
  },
  {
    name: 'UpgradableContracts',
    path: '/upgradable-contracts',
    component: <UpgradableContracts />
  },
  {
    name: 'GnosisSafe',
    path: '/gnosis-safe',
    component: <GnosisSafe />
  }
]

const _routesMap = {}

routesList.map(route => {
  _routesMap[route.name] = route
})

export const routesMap = _routesMap
