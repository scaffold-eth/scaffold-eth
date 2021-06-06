import dotProp from 'dot-prop-immutable'

import { actionCreators as levelContainerActionCreators } from '../../../../../../containers/level/controller'
import { actionCreators as backgroundActionCreators } from '../../../../../Background/controller'
import { actionCreators as dialogsContainerActionCreators } from '../../../../../../containers/dialogs/controller'

const stateContainerId = 'levels/__templateLevel__/terminalContent'

const initialState = {}

const mapStateToProps = state => {
  const { dialogs, __templateLevel__ } = state
  return {
    dialogs,
    ...__templateLevel__.terminalContent
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    switch (action.type) {
      default:
        return state
    }
  }
  return state
}

const actionCreators = {}

const dispatchers = {}

const mapDispatchToProps = dispatch => ({
  actions: {
    continueDialog() {
      dispatch(dialogsContainerActionCreators.continueDialog())
    },
    start__templateLevel__() {
      dispatch(levelContainerActionCreators.setCurrentLevel({ level: '__templateLevel__' })) // TODO: import string from constants list
    },
    // TODO: move this into levelContainer reducer
    set__templateLevel__Background() {
      dispatch(backgroundActionCreators.setBackground({ background: '__templateLevel__' })) // TODO: import string from constants list
    },
    // TODO: move this into levelContainer reducer
    set__templateLevel__Dialog() {
      dispatch(dialogsContainerActionCreators.setCurrentDialog({ dialog: '__templateLevel__' })) // TODO: import string from constants list
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
