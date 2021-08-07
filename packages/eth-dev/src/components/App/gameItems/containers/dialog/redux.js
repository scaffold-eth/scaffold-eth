/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import dotProp from 'dot-prop-immutable'

const stateContainerId = 'dialog'

export const INIT_DIALOG = `${stateContainerId}/INIT_DIALOG`
export const CONTINUE_DIALOG = `${stateContainerId}/CONTINUE_DIALOG`
export const JUMP_TO_DIALOG_PATH = `${stateContainerId}/JUMP_TO_DIALOG_PATH`
export const RESET_DIALOG = `${stateContainerId}/RESET_DIALOG`

const initialState = {
  dialogIndexMap: {},
  currentDialog: null,
  currentDialogIndex: 0,
  dialogPathsVisibleToUser: []
}

const mapStateToProps = state => {
  const { dialog } = state
  return {}
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    if (action.type === INIT_DIALOG) {
      const { initialDialogPathId, currentDialog } = payload
      state = dotProp.set(state, 'dialogPathsVisibleToUser', [initialDialogPathId])
      const dialogIndexMap = {}
      for (let i = 0; i < currentDialog.length; i++) {
        dialogIndexMap[i] = { visibleToUser: i === 0 }
      }
      state = dotProp.set(state, 'dialogIndexMap', dialogIndexMap)
      state = dotProp.set(state, 'currentDialog', currentDialog)
      return dotProp.set(state, 'currentDialogIndex', 0)
    }

    if (action.type === CONTINUE_DIALOG) {
      if (state.currentDialogIndex < state.currentDialog.length - 1) {
        const newDialogIndex = state.currentDialogIndex + 1
        const { dialogIndexMap } = state
        dialogIndexMap[newDialogIndex].visibleToUser = true
        state = dotProp.set(state, 'dialogIndexMap', dialogIndexMap)
        return dotProp.set(state, 'currentDialogIndex', newDialogIndex)
      }
      return state
    }

    if (action.type === JUMP_TO_DIALOG_PATH) {
      const { currentDialogIndex, dialogIndexMap } = state

      // determine new currentDialogIndex
      let newCurrentDialogIndex
      payload.currentDialog.map((dialogPart, index) => {
        if (!newCurrentDialogIndex && dialogPart.dialogPathId === payload.dialogPathId) {
          newCurrentDialogIndex = index
        }
      })

      if (!newCurrentDialogIndex) newCurrentDialogIndex = currentDialogIndex

      // add dialogPathId to dialogParts that are visible to the user
      state = dotProp.set(state, 'dialogPathsVisibleToUser', [
        ...state.dialogPathsVisibleToUser,
        payload.dialogPathId
      ])
      // update dialogIndexMap
      dialogIndexMap[newCurrentDialogIndex].visibleToUser = true
      state = dotProp.set(state, 'dialogIndexMap', dialogIndexMap)
      // update currentDialogIndex
      return dotProp.set(state, 'currentDialogIndex', newCurrentDialogIndex)
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
  continueDialog: () => ({
    type: CONTINUE_DIALOG
  }),
  jumpToDialogPath: payload => ({
    type: JUMP_TO_DIALOG_PATH,
    payload
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
  continueDialog: () => {
    return actionCreators.continueDialog()
  },
  jumpToDialogPath: payload => {
    return actionCreators.jumpToDialogPath(payload)
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
    continueDialog() {
      dispatch(actionCreators.continueDialog())
    },
    jumpToDialogPath(payload) {
      dispatch(actionCreators.jumpToDialogPath(payload))
    },
    resetCurrentDialog(payload) {
      dispatch(actionCreators.resetCurrentDialog(payload))
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
