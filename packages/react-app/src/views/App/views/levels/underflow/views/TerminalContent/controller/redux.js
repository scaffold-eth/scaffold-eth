import dotProp from 'dot-prop-immutable'

import { actionCreators as levelContainerActionCreators } from '../../../../../../containers/level/controller'
import { actionCreators as backgroundActionCreators } from '../../../../../Background/controller'
import { actionCreators as dialogsContainerActionCreators } from '../../../../../../containers/dialogs/controller'

const stateContainerId = 'levels/underflowLevel/terminalContent'

const initialState = {}

const mapStateToProps = state => {
  const { dialogs, underflowLevel } = state
  return {
    dialogs,
    ...underflowLevel.terminalContent
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
    startCityLevel() {
      dispatch(levelContainerActionCreators.setCurrentLevel({ level: 'city' })) // TODO: import string from constants list
    },
    // TODO: move this into levelContainer reducer
    setCityLevelBackground() {
      dispatch(backgroundActionCreators.setBackground({ background: 'city' })) // TODO: import string from constants list
    },
    // TODO: move this into levelContainer reducer
    setCityLevelDialog() {
      dispatch(dialogsContainerActionCreators.setCurrentDialog({ dialog: 'city' })) // TODO: import string from constants list
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
