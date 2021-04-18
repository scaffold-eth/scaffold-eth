import dotProp from 'dot-prop-immutable'
import { actionCreators as dialogContainerActionCreators } from '../../DialogContainer/controller'

export const TOGGLE_VISIBLITY = 'wallet/TOGGLE_VISIBLITY'

const initialState = {
  visible: false
}

const mapStateToProps = state => {
  const { wallet, dialogContainer } = state
  return {
    ...wallet,
    dialogContainer
  }
}

const reducer = (state = initialState, action) => {
  const newState = { ...state }

  switch (action.type) {
    case TOGGLE_VISIBLITY:
      newState.visible = !state.visible
      return newState
    default:
      return newState
  }
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
      dispatch(dialogContainerActionCreators.setCurrentDialog(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
