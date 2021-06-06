import dotProp from 'dot-prop-immutable'
import { actionCreators as dialogsContainerActionCreators } from '../../../containers/dialogs/controller'

const stateContainerId = 'wallet'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`

const initialState = {
  visible: false
}

const mapStateToProps = state => {
  const { wallet, terminal } = state
  return {
    ...wallet,
    terminal
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    switch (action.type) {
      case TOGGLE_VISIBLITY:
        return dotProp.set(state, 'visible', !state.visible)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  toggleVisibility: () => ({
    type: TOGGLE_VISIBLITY
  })
}

const dispatchers = {
  toggleVisibility: () => {
    return actionCreators.toggleVisibility()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleVisibility() {
      dispatch(actionCreators.toggleVisibility())
    },
    setCurrentDialog(payload) {
      dispatch(dialogsContainerActionCreators.setCurrentDialog(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
