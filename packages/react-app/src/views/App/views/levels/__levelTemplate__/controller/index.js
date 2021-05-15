import { combineReducers } from 'redux'

import { reducer as terminalContent } from '../views/TerminalContent/controller'
import { reducer as levelContainerContent } from '../views/LevelContainerContent/controller'
// TODO:
// import { reducer as walletContent } from '../views/WalletContent/controller'

const reducer = combineReducers({
  terminalContent,
  levelContainerContent
})

export { reducer }
