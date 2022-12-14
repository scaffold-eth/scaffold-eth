import { ClassNameMap } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

export type Reward = {
  id: string
  to: string
  resolvedName: string
  transactionHash: string
  tokenType: string
  payload: string
  hash: string
}

export type EventBadge = {
  id: string
  to: string
  transactionHash: string
}

export type RewardNames =
  | 'Beta Tester'
  | 'Contributor'
  | 'Dev Connector'
  | 'Release Manager'
  | 'Remixer'
  | 'UX Champion'
  | 'Specials'

export type Badge = {
  address: string
  blockHash: string
  blockNumber: string
  data: string
  logIndex: string
  removed: boolean
  topics: string[]
  transactionHash: string
  transactionIndex: string
}

export type RewardKey = keyof Reward

export type RewardGroups = {
  [key in RewardKey]: Array<Reward>
}

export interface BadgesPaginatedSectionProps {
  badges: any[]
  checkeventBagesAndBadges: (badges: any[]) => boolean
  etherscanRef: any
  eventBadges: Array<Reward>
  injectedProvider: any
  setBadges: Dispatch<SetStateAction<any[]>>
  checkForWeb3Provider: () => 'Not Found' | 'Found'
  groupedRewards: any
}

export interface NftCardProps {
  etherscan: any
  to: string
  id: string
  transactionHash: string
  contract: any
  mainnet: any
}

export interface TokensData {
  payload: string
  tokenType: string
  hash: string
}

export interface NavbarProps {
  useStyles: (props?: any) => ClassNameMap<'logo'>
  tabValue: number
  setTabValue: Dispatch<SetStateAction<number>>
}

export interface NetInfoProps {
  netInfo: any[]
  setNetInfo: Dispatch<SetStateAction<any>>
  connectedAddress: string
  checkForWeb3Provider: () => 'Not Found' | 'Found'
  displayToast: () => boolean
}

export interface BadgeContextProps {
  localProvider: any
  mainnet: any
  selectedChainId: any
  setSelectedChainId: any
  address: any
  setAddress: any
  checkForWeb3Provider: any
  connectedAddress: any
  setConnectedAddress: any
  injectedProvider: any
  setInjectedProvider: any
  contractConfig: any
  displayToast: any
  externalContracts: any
  contractRef: any
  setShowToast: any
  closeWrongNetworkToast: any
  showWrongNetworkToast: any
  setShowWrongNetworkToast: any
  targetNetwork: any
}

export interface MenuItemsProps {
  tabValue: number
  setTabValue: Dispatch<React.SetStateAction<number>>
}
