import { combineReducers } from 'redux'

import { reducer as levelContainer } from '../components/App/gameItems/containers/level/controller'
import { reducer as dialog } from '../components/App/gameItems/containers/dialog'

import { reducer as terminal } from '../components/App/gameItems/components/Terminal/controller'
import { reducer as wallet } from '../components/App/gameItems/components/Wallet/controller'
import { reducer as toolbelt } from '../components/App/gameItems/components/Toolbelt/controller'
import { reducer as dish } from '../components/App/gameItems/components/Dish/controller'

const rootReducer = combineReducers({
  levelContainer,
  dialog,

  terminal,
  wallet,
  toolbelt,
  dish
})

export default rootReducer
