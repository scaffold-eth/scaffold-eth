import { actionCreators as terminalActionCreators } from '../../Terminal/controller'
import { actionCreators as dishActionCreators } from '../../Dish/controller'

export const TOGGLE_VISIBLITY = 'toolbelt/TOGGLE_VISIBLITY'
export const SET_VISIBLITY = 'toolbelt/SET_VISIBLITY'

const initialState = {
  visible: false
}

const mapStateToProps = state => {
  const { toolbelt, dialogContainer } = state
  return {
    ...toolbelt,
    dialogContainer
  }
}

const reducer = (state = initialState, action) => {
  const newState = { ...state }
  const { payload } = action

  switch (action.type) {
    case TOGGLE_VISIBLITY:
      newState.visible = !state.visible
      return newState
    case SET_VISIBLITY:
      newState.visible = payload.visible
      return newState
    default:
      return newState
  }
}

const actionCreators = {
  toggleVisibility: () => ({
    type: TOGGLE_VISIBLITY
  }),
  setVisibility: payload => ({
    type: TOGGLE_VISIBLITY,
    payload
  })
}

const dispatchers = {
  toggleVisibility: () => {
    return actionCreators.toggleVisibility()
  },
  setVisibility: payload => {
    return actionCreators.setVisibility(payload)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleVisibility() {
      dispatch(actionCreators.toggleVisibility())
    },
    setVisibility(payload) {
      dispatch(actionCreators.setVisibility(payload))
    },
    toggleDishVisibility() {
      dispatch(dishActionCreators.toggleVisibility())
    },
    toggleTerminalVisibility() {
      dispatch(terminalActionCreators.toggleVisibility())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
