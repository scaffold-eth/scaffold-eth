import { combineReducers } from 'redux'

import { reducer as terminal } from '../views/App/views/Terminal'
import { reducer as wallet } from '../views/App/views/Wallet'
import { reducer as dialogContainer } from '../views/App/views/DialogContainer'
import { reducer as toolbelt } from '../views/App/views/Toolbelt'
import { reducer as dish } from '../views/App/views/Dish'

const rootReducer = combineReducers({
  terminal,
  wallet,
  dialogContainer,
  toolbelt,
  dish
})

export default rootReducer
