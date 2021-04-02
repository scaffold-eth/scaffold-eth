import deepcopy from 'deepcopy'
import dialogs from '../model/dialogs/underflowLevel'
import { actionCreators as terminalActionCreators } from '../../Terminal/controller'
import { actionCreators as toolbeltActionCreators } from '../../Toolbelt/controller'

export const TOGGLE_DIALOG_VISIBILITY = 'dialogModal/TOGGLE_DIALOG_VISIBILITY'
export const CURRENT_DIALOG_SET = 'dialogModal/CURRENT_DIALOG_SET'
export const CURRENT_DIALOG_CONTINUE = 'dialogModal/CURRENT_DIALOG_CONTINUE'

const initialState = {
  dialogVisible: true,
  currentDialog: {
    name: 'intro',
    // name: 'setupCodingEnv',
    index: 0
  },
  dialogs
}

const mapStateToProps = state => {
  const { dialogModal } = state
  return {
    ...dialogModal
  }
}

const reducer = (state = initialState, action) => {
  const newState = deepcopy(state)
  const { payload } = action

  switch (action.type) {
    case TOGGLE_DIALOG_VISIBILITY:
      newState.dialogVisible = !state.dialogVisible
      return newState
    case CURRENT_DIALOG_SET:
      newState.currentDialog.name = payload.name
      newState.currentDialog.index = 0
      newState.dialogVisible = true
      return newState
    case CURRENT_DIALOG_CONTINUE:
      if (state.currentDialog.index < state.dialogs[state.currentDialog.name].length) {
        newState.currentDialog.index = state.currentDialog.index + 1
      }
      return newState
    default:
      return newState
  }
}

const actionCreators = {
  toggleDialogVisibility: () => ({
    type: TOGGLE_DIALOG_VISIBILITY
  }),
  setCurrentDialog: payload => ({
    type: CURRENT_DIALOG_SET,
    payload
  }),
  continueCurrentDialog: () => ({
    type: CURRENT_DIALOG_CONTINUE
  })
}

const dispatchers = {
  toggleDialogVisibility: () => {
    return actionCreators.toggleDialogVisibility()
  },
  setCurrentDialog: payload => {
    return actionCreators.setCurrentDialog(payload)
  },
  continueCurrentDialog: () => {
    return actionCreators.continueCurrentDialog()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleDialogVisibility() {
      dispatch(actionCreators.toggleDialogVisibility())
    },
    setCurrentDialog(payload) {
      dispatch(actionCreators.setCurrentDialog(payload))
    },
    continueCurrentDialog() {
      dispatch(actionCreators.continueCurrentDialog())
    },
    toggleRinging() {
      dispatch(terminalActionCreators.toggleRinging())
    },
    setToolbeltVisibility() {
      dispatch(toolbeltActionCreators.setVisibility())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
