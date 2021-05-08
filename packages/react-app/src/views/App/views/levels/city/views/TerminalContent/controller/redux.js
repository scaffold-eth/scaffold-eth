import dotProp from 'dot-prop-immutable'

import { actionCreators as terminalActionCreators } from '../../../../../Terminal/controller/redux'

const initialState = {
  currentLevel: 'underflow'
}

const mapStateToProps = state => {
  const { terminal } = state
  return {
    ...terminal
  }
}

const reducer = (state = initialState, action) => {
  const newState = { ...state }

  switch (action.type) {
    default:
      return newState
  }
}

const actionCreators = {}

const dispatchers = {}

const mapDispatchToProps = dispatch => ({
  actions: {
    setCurrentDialog(payload) {
      dispatch(terminalActionCreators.setCurrentDialog(payload))
    },
    continueCurrentDialog() {
      dispatch(terminalActionCreators.continueCurrentDialog())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
