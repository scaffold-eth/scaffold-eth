import dotProp from 'dot-prop-immutable'

// import initialDialog from '../../../views/levels/__templateLevel__/model/dialog'
import initialDialog from '../../../views/levels/underflow/model/dialog'
import dialogMap from '../model/dialogMap'

const stateContainerId = 'dialogs'

export const SET_DIALOG = `${stateContainerId}/SET_DIALOG`
export const CONTINUE_DIALOG = `${stateContainerId}/CONTINUE_DIALOG`

const initialState = {
  currentDialog: initialDialog,
  currentDialogIndex: 0
}

const mapStateToProps = state => {
  const { dialogs } = state
  return {}
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    switch (action.type) {
      case SET_DIALOG:
        state = dotProp.set(state, 'currentDialogIndex', 0)
        return dotProp.set(state, 'currentDialog', dialogMap[payload.dialog])
      case CONTINUE_DIALOG:
        if (state.currentDialogIndex < state.currentDialog.length - 1) {
          return dotProp.set(state, 'currentDialogIndex', state.currentDialogIndex + 1)
        }
        return state
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  setCurrentDialog: payload => ({
    type: SET_DIALOG,
    payload
  }),
  continueDialog: () => ({
    type: CONTINUE_DIALOG
  })
}

const dispatchers = {
  setCurrentDialog: payload => {
    return actionCreators.setCurrentDialog(payload)
  },
  continueDialog: () => {
    return actionCreators.continueDialog()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    setCurrentDialog(payload) {
      dispatch(actionCreators.setCurrentDialog(payload))
    },
    continueDialog() {
      dispatch(actionCreators.continueDialog())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
