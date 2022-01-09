import { combineReducers } from 'redux'

import { reducer as levelContainer } from '../components/gameItems/containers/level/controller'
import { reducer as dialog } from '../components/gameItems/containers/dialog'

import { reducer as background } from '../components/gameItems/components/Background/controller'
import { reducer as monologWindow } from '../components/gameItems/components/MonologWindow/controller'
import { reducer as terminal } from '../components/gameItems/components/Terminal/controller'
import { reducer as wallet } from '../components/gameItems/components/Wallet/controller'
import { reducer as toolbelt } from '../components/gameItems/components/Toolbelt/controller'
import { reducer as dish } from '../components/gameItems/components/Dish/controller'

const rootReducer = combineReducers({
  levelContainer,
  dialog,

  background,
  monologWindow,
  terminal,
  wallet,
  toolbelt,
  dish
})

export default rootReducer
