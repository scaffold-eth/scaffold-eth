import dotProp from 'dot-prop-immutable'

export const TOGGLE_VISIBLITY = 'dish/TOGGLE_VISIBLITY'
export const TOGGLE_CONNECTING = 'dish/TOGGLE_CONNECTING'

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
  const newState = { ...state }

  switch (action.type) {
    case TOGGLE_VISIBLITY:
      newState.visible = !state.visible
      return newState
    case TOGGLE_CONNECTING:
      newState.connecting = !state.connecting
      return newState
    default:
      return newState
  }
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
