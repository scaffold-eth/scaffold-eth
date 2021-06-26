import dotProp from 'dot-prop-immutable'

import { prepareDialog } from './helpers'

const stateContainerId = 'dialog'

export const INIT_DIALOG = `${stateContainerId}/INIT_DIALOG`
export const JUMP_TO_DIALOG_PART = `${stateContainerId}/JUMP_TO_DIALOG_PART`
export const CONTINUE_DIALOG = `${stateContainerId}/CONTINUE_DIALOG`
export const RESET_DIALOG = `${stateContainerId}/RESET_DIALOG`

const initialState = {
  dialogLength: 0,
  currentDialogIndex: 0,
  selectedDialogParts: []
}

const mapStateToProps = state => {
  const { dialog } = state
  return {}
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    if (action.type === INIT_DIALOG) {
      return dotProp.set(state, 'dialogLength', payload.dialogLength)
    }

    if (action.type === JUMP_TO_DIALOG_PART) {
      // TODO:
      // add dialogPartId to selectedDialogParts
      state.selectedDialogParts.push(payload.dialogPartId)
      // mark dialog with dialogPartId as visible
      // state.currentDialog[dialogPartIdIndex].visibleToUser = true
      // return dotProp.set(state, 'currentDialogIndex', dialogPartIdIndex)
    }

    if (action.type === CONTINUE_DIALOG) {
      if (state.currentDialogIndex < state.dialogLength - 1) {
        const newDialogIndex = state.currentDialogIndex + 1
        return dotProp.set(state, 'currentDialogIndex', newDialogIndex)
      }
      return state
    }

    if (action.type === RESET_DIALOG) {
      return dotProp.set(state, 'currentDialogIndex', 0)
    }

    return state
  }
  return state
}

const actionCreators = {
  initDialog: payload => ({
    type: INIT_DIALOG,
    payload
  }),
  jumpToDialogPart: payload => ({
    type: JUMP_TO_DIALOG_PART,
    payload
  }),
  continueDialog: () => ({
    type: CONTINUE_DIALOG
  }),
  resetCurrentDialog: payload => ({
    type: RESET_DIALOG,
    payload
  })
}

const dispatchers = {
  initDialog: payload => {
    return actionCreators.initDialog(payload)
  },
  jumpToDialogPart: payload => {
    return actionCreators.jumpToDialogPart(payload)
  },
  continueDialog: () => {
    return actionCreators.continueDialog()
  },
  resetCurrentDialog: payload => {
    return actionCreators.resetCurrentDialog(payload)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    initDialog(payload) {
      dispatch(actionCreators.initDialog(payload))
    },
    jumpToDialogPart(payload) {
      dispatch(actionCreators.jumpToDialogPart(payload))
    },
    continueDialog() {
      dispatch(actionCreators.continueDialog())
    },
    resetCurrentDialog(payload) {
      dispatch(actionCreators.resetCurrentDialog(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
