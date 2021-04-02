import { combineReducers } from 'redux'

import { reducer as terminal } from '../views/App/views/Terminal'
import { reducer as wallet } from '../views/App/views/Wallet'
import { reducer as dialogModal } from '../views/App/views/DialogModal'
import { reducer as toolbelt } from '../views/App/views/Toolbelt'
import { reducer as dish } from '../views/App/views/Dish'

const rootReducer = combineReducers({
  terminal,
  wallet,
  dialogModal,
  toolbelt,
  dish
})

export default rootReducer
