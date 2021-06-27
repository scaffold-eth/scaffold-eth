import { mapDispatchToProps as _level } from './containers/level/controller/redux'
import { mapDispatchToProps as _dialog } from './containers/dialog/redux'

import { mapDispatchToProps as _wallet } from './components/Wallet/controller/redux'
import { mapDispatchToProps as _terminal } from './components/Terminal/controller/redux'

const mapStateToProps = state => {
  const { levelContainer, levels, dialog, terminal, wallet } = state
  return {
    levelContainer,
    levels,
    dialog,
    terminal,
    wallet
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    level: _level(dispatch).actions,
    dialog: _dialog(dispatch).actions,
    wallet: _wallet(dispatch).actions,
    terminal: _terminal(dispatch).actions
  }
})

export { mapStateToProps, mapDispatchToProps }
