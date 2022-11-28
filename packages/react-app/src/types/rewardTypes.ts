import { Dispatch, SetStateAction } from "react"

export interface EventBadge 
{
  id: string,
  to: string,
  transactionHash: string,
  tokenType: string,
  payload: string,
  hash: string
}

export interface BadgesPaginatedSectionProps {
  badges: any[]
  checkeventBagesAndBadges: (badges: any[]) => boolean
  etherscanRef: any
  eventBadges: Array<EventBadge>
  injectedProvider: any
  setBadges: Dispatch<SetStateAction<any[]>>
  checkForWeb3Provider: () => "Not Found" | "Found"
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

export interface NetInfoProps { 
  netInfo: any[]
  setNetInfo: Dispatch<SetStateAction<any>>
  connectedAddress: string
  checkForWeb3Provider: () => "Not Found" | "Found"
  displayToast: () => boolean
}

export interface BadgeContextProps 
{
    localProvider: any,
    mainnet: any,
    selectedChainId: any,
    setSelectedChainId: any,
    address: any,
    setAddress: any,
    checkForWeb3Provider: any,
    connectedAddress: any,
    setConnectedAddress: any,
    injectedProvider: any,
    setInjectedProvider: any,
    contractConfig: any,
    displayToast: any,
    externalContracts: any,
    contractRef: any,
    setShowToast: any,
    closeWrongNetworkToast: any,
    showWrongNetworkToast: any,
    setShowWrongNetworkToast: any,
    targetNetwork: any,
  }