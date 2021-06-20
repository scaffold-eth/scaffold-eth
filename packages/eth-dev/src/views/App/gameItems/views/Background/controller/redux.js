import dotProp from 'dot-prop-immutable'

const stateContainerId = 'background'

export const SET_BACKGROUND = `${stateContainerId}/SET_BACKGROUND`

const initialState = {
  pathToCurrentBackground: './assets/layers/city_outskirts.png'
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
      case SET_BACKGROUND:
        return dotProp.set(state, 'pathToCurrentBackground', payload.pathToBackground)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  setBackground: payload => ({
    type: SET_BACKGROUND,
    payload
  })
}

const dispatchers = {
  setBackground: payload => {
    return actionCreators.setBackground(payload)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    setBackground(payload) {
      dispatch(dispatchers.setBackground(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
