import dotProp from 'dot-prop-immutable'

const initialLevel = 'setup-local-network'

const stateContainerId = 'levelContainer'

export const SET_CURRENT_LEVEL = `${stateContainerId}/SET_CURRENT_LEVEL`

const initialState = {
  currentLevel: initialLevel
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
        return dotProp.set(state, 'currentLevel', payload.levelId)
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
      dispatch(dispatchers.setCurrentLevel(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
