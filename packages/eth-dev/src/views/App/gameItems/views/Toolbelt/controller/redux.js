import dotProp from 'dot-prop-immutable'
import { actionCreators as terminalActionCreators } from '../../Terminal/controller'
import { actionCreators as dishActionCreators } from '../../Dish/controller'

const stateContainerId = 'toolbelt'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`
export const SET_VISIBLITY = `${stateContainerId}/SET_VISIBLITY`

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
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case TOGGLE_VISIBLITY:
        return dotProp.set(state, 'visible', !state.visible)
      case SET_VISIBLITY:
        return dotProp.set(state, 'visible', payload.visible)
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
