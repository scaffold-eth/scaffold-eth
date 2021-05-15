import { combineReducers } from 'redux'

import { reducer as levelContainer } from '../views/App/containers/level/controller'
import { reducer as background } from '../views/App/views/Background/controller'
import { reducer as dialogs } from '../views/App/containers/dialogs/controller'

import { reducer as terminal } from '../views/App/views/Terminal/controller'
import { reducer as wallet } from '../views/App/views/Wallet/controller'
import { reducer as toolbelt } from '../views/App/views/Toolbelt/controller'
import { reducer as dish } from '../views/App/views/Dish/controller'

// IMPORT NEW LEVEL HERE
// import { reducer as __templateLevel__ } from '../views/App/views/levels/__templateLevel__/controller'
import { reducer as underflowLevel } from '../views/App/views/levels/underflow/controller'

const rootReducer = combineReducers({
  levelContainer,
  background,
  dialogs,

  terminal,
  wallet,
  toolbelt,
  dish,

  // IMPORT NEW LEVEL HERE
  // __templateLevel__
  underflowLevel
})

export default rootReducer
