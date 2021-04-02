import dotProp from 'dot-prop-immutable'
import { actionCreators as dialogModalActionCreators } from '../../DialogModal/controller'

export const TOGGLE_VISIBLITY = 'terminal/TOGGLE_VISIBLITY'
export const TOGGLE_RINGING = 'terminal/TOGGLE_RINGING'

const initialState = {
  visible: false,
  ringing: false
}

const mapStateToProps = state => {
  const { terminal, dialogModal } = state
  return {
    ...terminal,
    dialogModal
  }
}

const reducer = (state = initialState, action) => {
  const newState = { ...state }

  switch (action.type) {
    case TOGGLE_VISIBLITY:
      newState.visible = !state.visible
      return newState
    case TOGGLE_RINGING:
      newState.ringing = !state.ringing
      return newState
    default:
      return newState
  }
}

const actionCreators = {
  toggleVisibility: () => ({
    type: TOGGLE_VISIBLITY
  }),
  toggleRinging: () => ({
    type: TOGGLE_RINGING
  })
}

const dispatchers = {
  toggleVisibility: () => {
    return actionCreators.toggleVisibility()
  },
  toggleRinging: () => {
    return actionCreators.toggleRinging()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleVisibility() {
      dispatch(actionCreators.toggleVisibility())
    },
    toggleRinging() {
      dispatch(actionCreators.toggleRinging())
    },
    setCurrentDialog(payload) {
      dispatch(dialogModalActionCreators.setCurrentDialog(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
