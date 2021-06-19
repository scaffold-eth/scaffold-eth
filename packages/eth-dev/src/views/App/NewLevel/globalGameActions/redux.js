import { mapDispatchToProps as level } from '../../containers/level/controller/redux'
import { mapDispatchToProps as dialog } from '../../containers/dialogs/controller/redux'
import { mapDispatchToProps as background } from '../../views/Background/controller/redux'
import { mapDispatchToProps as wallet } from '../../views/Wallet/controller/redux'
import { mapDispatchToProps as terminal } from '../../views/Terminal/controller/redux'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => ({
  actions: {
    level: level(dispatch).actions,
    dialog: dialog(dispatch).actions,
    background: background(dispatch).actions,
    wallet: wallet(dispatch).actions,
    terminal: terminal(dispatch).actions
  }
})

export { mapStateToProps, mapDispatchToProps }
