import dotProp from 'dot-prop-immutable'

const stateContainerId = 'terminal'

export const TERMINAL_SHOW = `${stateContainerId}/TERMINAL_SHOW`
export const TERMINAL_HIDE = `${stateContainerId}/TERMINAL_HIDE`

const initialState = {
  terminalVisible: true
}

const mapStateToProps = state => {
  const { dialogs, levelContainer, terminal } = state
  return {
    levelContainer,
    dialogs,
    ...terminal
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case TERMINAL_SHOW:
        return dotProp.set(state, 'terminalVisible', !state.terminalVisible)
      case TERMINAL_HIDE:
        return dotProp.set(state, 'terminalVisible', !state.terminalVisible)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  showTerminal: () => ({
    type: TERMINAL_SHOW
  }),
  hideTerminal: () => ({
    type: TERMINAL_HIDE
  })
}

const dispatchers = {
  showTerminal: () => {
    return actionCreators.showTerminal()
  },
  hideTerminal: () => {
    return actionCreators.hideTerminal()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    showTerminal() {
      dispatch(actionCreators.showTerminal())
    },
    hideTerminal() {
      dispatch(actionCreators.hideTerminal())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
