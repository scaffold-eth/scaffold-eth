import dotProp from 'dot-prop-immutable'

const stateContainerId = 'terminal'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`
export const TERMINAL_SHOW = `${stateContainerId}/TERMINAL_SHOW`
export const TERMINAL_HIDE = `${stateContainerId}/TERMINAL_HIDE`

const initialState = {
  terminalVisible: true
}

const mapStateToProps = state => {
  const { dialog, levelContainer, terminal } = state
  return {
    levelContainer,
    dialog,
    ...terminal
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case TOGGLE_VISIBLITY:
        return dotProp.set(state, 'terminalVisible', !state.terminalVisible)
      case TERMINAL_SHOW:
        return dotProp.set(state, 'terminalVisible', true)
      case TERMINAL_HIDE:
        return dotProp.set(state, 'terminalVisible', false)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  toggleTerminalVisibility: () => ({
    type: TOGGLE_VISIBLITY
  }),
  showTerminal: () => ({
    type: TERMINAL_SHOW
  }),
  hideTerminal: () => ({
    type: TERMINAL_HIDE
  })
}

const dispatchers = {
  toggleTerminalVisibility: () => {
    return actionCreators.toggleTerminalVisibility()
  },
  showTerminal: () => {
    return actionCreators.showTerminal()
  },
  hideTerminal: () => {
    return actionCreators.hideTerminal()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleTerminalVisibility() {
      dispatch(actionCreators.toggleTerminalVisibility())
    },
    showTerminal() {
      dispatch(actionCreators.showTerminal())
    },
    hideTerminal() {
      dispatch(actionCreators.hideTerminal())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
