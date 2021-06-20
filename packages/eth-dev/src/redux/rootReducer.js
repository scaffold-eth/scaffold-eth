import { combineReducers } from 'redux'

import { reducer as levelContainer } from '../views/App/gameItems/containers/level/controller'
import { reducer as background } from '../views/App/gameItems/views/Background/controller'
import { reducer as dialog } from '../views/App/gameItems/containers/dialog'

import { reducer as terminal } from '../views/App/gameItems/views/Terminal/controller'
import { reducer as wallet } from '../views/App/gameItems/views/Wallet/controller'
import { reducer as toolbelt } from '../views/App/gameItems/views/Toolbelt/controller'
import { reducer as dish } from '../views/App/gameItems/views/Dish/controller'

const rootReducer = combineReducers({
  levelContainer,
  background,
  dialog,

  terminal,
  wallet,
  toolbelt,
  dish
})

export default rootReducer
