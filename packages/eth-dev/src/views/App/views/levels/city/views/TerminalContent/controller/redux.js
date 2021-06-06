import dotProp from 'dot-prop-immutable'

import { actionCreators as levelContainerActionCreators } from '../../../../../../containers/level/controller'
import { actionCreators as backgroundActionCreators } from '../../../../../Background/controller'
import { actionCreators as dialogsContainerActionCreators } from '../../../../../../containers/dialogs/controller'

const stateContainerId = 'levels/city/terminalContent'

const initialState = {}

const mapStateToProps = state => {
  const { dialogs, cityLevel } = state
  // TODO:
  console.log({ cityLevelState: cityLevel })
  return {
    dialogs
    // ...cityLevel.terminalContent
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
      dispatch(levelContainerActionCreators.setCurrentLevel('TODO')) // TODO: import string from constants list
    },
    setCityLevelBackground() {
      dispatch(backgroundActionCreators.setBackground('TODO')) // TODO: import string from constants list
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
