import dotProp from 'dot-prop-immutable'

const stateContainerId = 'dish'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`
export const TOGGLE_CONNECTING = `${stateContainerId}/TOGGLE_CONNECTING`

const initialState = {
  visible: false,
  connecting: false
}

const mapStateToProps = state => {
  const { dish } = state
  return {
    ...dish
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action
    switch (action.type) {
      case TOGGLE_VISIBLITY:
        return dotProp.set(state, 'visible', !state.visible)
      case TOGGLE_CONNECTING:
        return dotProp.set(state, 'connecting', !state.connecting)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  toggleVisibility: () => ({
    type: TOGGLE_VISIBLITY
  }),
  toggleConnecting: () => ({
    type: TOGGLE_CONNECTING
  })
}

const dispatchers = {
  toggleVisibility: () => {
    return actionCreators.toggleVisibility()
  },
  toggleConnecting: () => {
    return actionCreators.toggleConnecting()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleVisibility() {
      dispatch(actionCreators.toggleVisibility())
    },
    toggleConnecting() {
      dispatch(actionCreators.toggleConnecting())
    }
  }
})

export {
  reducer,
  mapStateToProps,
  actionCreators,
  dispatchers,
  mapDispatchToProps
}
