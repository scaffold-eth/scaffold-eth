/* eslint-disable react/jsx-props-no-spreading */
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

import CreateDAO from './components/levels/CreateDAO'
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
    component: props => <Intro {...props} />
  },
  {
    name: 'Challenge0SimpleNFT',
    path: '/challenge-0-simple-nft',
    component: props => <Challenge0SimpleNFT {...props} />
  },
  {
    name: 'Challenge1DecentralizedStaking',
    path: '/challenge-1-decentralized-staking',
    component: props => <Challenge1DecentralizedStaking {...props} />
  },
  {
    name: 'Challenge2TokenVendor',
    path: '/challenge-2-token-vendor',
    component: props => <Challenge2TokenVendor {...props} />
  },
  {
    name: 'Challenge3Dex',
    path: '/challenge-3-dex',
    component: props => <Challenge3Dex {...props} />
  },
  {
    name: 'Challenge5MultiSig',
    path: '/challenge-5-multi-sig',
    component: props => <Challenge5MultiSig {...props} />
  },
  {
    name: 'ScaffoldEthOverview',
    path: '/scaffold-eth-overview',
    component: props => <ScaffoldEthOverview {...props} />
  },
  {
    name: 'UnderflowBug',
    path: '/underflow-bug',
    component: props => <UnderflowBug {...props} />
  },
  {
    name: 'SetupLocalNetwork',
    path: '/setup-local-network',
    component: props => <SetupLocalNetwork {...props} />
  },
  {
    name: 'CreateWallet',
    path: '/create-wallet',
    component: props => <CreateWallet {...props} />
  },
  {
    name: 'SetupMetamask',
    path: '/setup-metamask',
    component: props => <SetupMetamask {...props} />
  },
  {
    name: 'GamblingContract',
    path: '/gambling-contract',
    component: props => <GamblingContract {...props} />
  },
  {
    name: 'CreateDAO',
    path: '/create-dao',
    component: props => <CreateDAO {...props} />
  },
  {
    name: 'DAOHack',
    path: '/dao-hack',
    component: props => <DAOHack {...props} />
  },
  {
    name: 'FlashLoans',
    path: '/flash-loans',
    component: props => <FlashLoans {...props} />
  },
  {
    name: 'ERC20',
    path: '/erc20',
    component: props => <ERC20 {...props} />
  },
  {
    name: 'BondingCurves',
    path: '/bonding-curves',
    component: props => <BondingCurves {...props} />
  },
  {
    name: 'ENS',
    path: '/ens',
    component: props => <ENS {...props} />
  },
  {
    name: 'UpgradableContracts',
    path: '/upgradable-contracts',
    component: props => <UpgradableContracts {...props} />
  },
  {
    name: 'GnosisSafe',
    path: '/gnosis-safe',
    component: props => <GnosisSafe {...props} />
  }
]

const _routesMap = {}

routesList.map(route => {
  _routesMap[route.name] = route
})

export const routesMap = _routesMap
