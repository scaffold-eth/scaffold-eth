import { createContext } from 'react'
import { BadgeContextProps } from '../types/rewardTypes'

export const BadgeContext = createContext<BadgeContextProps>({} as BadgeContextProps)
