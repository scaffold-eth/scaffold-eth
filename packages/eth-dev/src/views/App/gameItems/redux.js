import { mapDispatchToProps as _level } from './containers/level/controller/redux'
import { mapDispatchToProps as _dialog } from './containers/dialog/redux'
import { mapDispatchToProps as _background } from './views/Background/controller/redux'
import { mapDispatchToProps as _wallet } from './views/Wallet/controller/redux'
import { mapDispatchToProps as _terminal } from './views/Terminal/controller/redux'

/*
    add global Window wrapper
      - with showWindow(id), hideWindow(id)

    add the following actions:

    setCurrentLevel(id)

    setBackground('path/to/background.jpg)
    showWallet()
    hideWallet()
    showTerminal()
    hideTerminal()

    setDialog()
    advanceDialog()
    jumpToDialogPart(part)
  */

const mapStateToProps = state => {
  const { levelContainer, levels, background, dialog, terminal, wallet } = state
  return {
    levelContainer,
    levels,
    background,
    dialog,
    terminal,
    wallet
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    level: _level(dispatch).actions,
    dialog: _dialog(dispatch).actions,
    background: _background(dispatch).actions,
    wallet: _wallet(dispatch).actions,
    terminal: _terminal(dispatch).actions
  }
})

export { mapStateToProps, mapDispatchToProps }
