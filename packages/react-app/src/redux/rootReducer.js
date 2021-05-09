import { combineReducers } from 'redux'

import { reducer as levelContainer } from '../views/App/containers/level/controller'
import { reducer as background } from '../views/App/views/Background/controller'
import { reducer as dialogs } from '../views/App/containers/dialogs/controller'

import { reducer as terminal } from '../views/App/views/Terminal/controller'
import { reducer as wallet } from '../views/App/views/Wallet/controller'
import { reducer as toolbelt } from '../views/App/views/Toolbelt/controller'
import { reducer as dish } from '../views/App/views/Dish/controller'

import { reducer as underflowLevel } from '../views/App/views/levels/underflow/controller'

const rootReducer = combineReducers({
  levelContainer,
  background,
  dialogs,

  terminal,
  wallet,
  toolbelt,
  dish,

  underflowLevel
})

export default rootReducer
