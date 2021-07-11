import dotProp from 'dot-prop-immutable'

const stateContainerId = 'background'

export const SET_CURRENT_BACKGROUND = `${stateContainerId}/SET_CURRENT_BACKGROUND`

const initialState = {
  currentBackground: 'intro'
}

const mapStateToProps = state => {
  const { background } = state
  return {
    ...background
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case SET_CURRENT_BACKGROUND:
        return dotProp.set(state, 'currentBackground', payload.background)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  setCurrentBackground: payload => ({
    type: SET_CURRENT_BACKGROUND,
    payload
  })
}

const dispatchers = {
  setCurrentBackground: payload => {
    return actionCreators.setCurrentBackground(payload)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    setCurrentBackground(payload) {
      dispatch(dispatchers.setCurrentBackground(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
