import dotProp from 'dot-prop-immutable'

const stateContainerId = 'terminal'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`
export const TERMINAL_SHOW = `${stateContainerId}/TERMINAL_SHOW`
export const TERMINAL_HIDE = `${stateContainerId}/TERMINAL_HIDE`
export const SHOW_NOTIFICATION_DELAYED = `${stateContainerId}/SHOW_NOTIFICATION_DELAYED`

const initialState = {
  isOpen: false,
  showMessageNotification: {
    delayInSeconds: null
  }
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
        return dotProp.set(state, 'isOpen', !state.isOpen)
      case TERMINAL_SHOW:
        return dotProp.set(state, 'isOpen', true)
      case TERMINAL_HIDE:
        return dotProp.set(state, 'isOpen', false)
      case SHOW_NOTIFICATION_DELAYED:
        return dotProp.set(state, 'showMessageNotification', payload)
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
  }),
  showMessageNotification: payload => ({
    type: SHOW_NOTIFICATION_DELAYED,
    payload
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
  },
  showMessageNotification: payload => {
    return actionCreators.showMessageNotification(payload)
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
    },
    showMessageNotification(payload) {
      dispatch(actionCreators.showMessageNotification(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
