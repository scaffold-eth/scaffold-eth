import dotProp from 'dot-prop-immutable'

const stateContainerId = 'monologWindow'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`
export const MONOLOG_WINDOW_SHOW = `${stateContainerId}/MONOLOG_WINDOW_SHOW`
export const MONOLOG_WINDOW_HIDE = `${stateContainerId}/MONOLOG_WINDOW_HIDE`

const initialState = {
  isVisible: true
}

const mapStateToProps = state => {
  const { dialog, levelContainer, monologWindow } = state
  return {
    levelContainer,
    dialog,
    ...monologWindow
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case TOGGLE_VISIBLITY:
        return dotProp.set(state, 'isVisible', !state.isVisible)
      case MONOLOG_WINDOW_SHOW:
        return dotProp.set(state, 'isVisible', true)
      case MONOLOG_WINDOW_HIDE:
        return dotProp.set(state, 'isVisible', false)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  toggleMonologVisibility: () => ({
    type: TOGGLE_VISIBLITY
  }),
  showMonolog: () => ({
    type: MONOLOG_WINDOW_SHOW
  }),
  hideMonolog: () => ({
    type: MONOLOG_WINDOW_HIDE
  })
}

const dispatchers = {
  toggleMonologVisibility: () => {
    return actionCreators.toggleMonologVisibility()
  },
  showMonolog: () => {
    return actionCreators.showMonolog()
  },
  hideMonolog: () => {
    return actionCreators.hideMonolog()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleMonologVisibility() {
      dispatch(actionCreators.toggleMonologVisibility())
    },
    showMonolog() {
      dispatch(actionCreators.showMonolog())
    },
    hideMonolog() {
      dispatch(actionCreators.hideMonolog())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
