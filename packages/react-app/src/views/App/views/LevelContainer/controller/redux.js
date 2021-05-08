import dotProp from 'dot-prop-immutable'
import { actionCreators as terminalActionCreators } from '../../Terminal/controller'
import LEVELS from '../model/levels'

const stateContainerId = 'levelContainer'

export const SET_CURRENT_LEVEL = `${stateContainerId}/SET_CURRENT_LEVEL`

const initialState = {
  currentLevel: LEVELS.overflow
}

const mapStateToProps = state => {
  const { levelContainer } = state
  return {
    ...levelContainer
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case SET_CURRENT_LEVEL:
        return dotProp.set(state, 'currentLevel', payload.level)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  setCurrentLevel: payload => ({
    type: SET_CURRENT_LEVEL,
    payload
  })
}

const dispatchers = {
  setCurrentLevel: payload => {
    return actionCreators.setCurrentLevel(payload)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    setCurrentLevel(payload) {
      dispatch(terminalActionCreators.setCurrentLevel(payload))
    },
    setBackground(payload) {
      dispatch(terminalActionCreators.setBackground(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
