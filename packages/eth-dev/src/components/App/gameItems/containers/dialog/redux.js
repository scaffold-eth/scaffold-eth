import dotProp from 'dot-prop-immutable'

const stateContainerId = 'dialog'

export const INIT_DIALOG = `${stateContainerId}/INIT_DIALOG`
export const CONTINUE_DIALOG = `${stateContainerId}/CONTINUE_DIALOG`
export const JUMP_TO_DIALOG_PATH = `${stateContainerId}/JUMP_TO_DIALOG_PATH`
export const RESET_DIALOG = `${stateContainerId}/RESET_DIALOG`

const initialState = {
  dialogIndexMap: {},
  dialogLength: 0,
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
      const { initialDialogPartId, dialogLength } = payload
      state = dotProp.set(state, 'dialogPathsVisibleToUser', [initialDialogPartId])
      const dialogIndexMap = {}
      for (let i = 0; i < dialogLength; i++) {
        dialogIndexMap[i] = { visibleToUser: i === 0 }
      }
      state = dotProp.set(state, 'dialogIndexMap', dialogIndexMap)
      console.log({ dialogIndexMap })
      return dotProp.set(state, 'dialogLength', dialogLength)
    }

    if (action.type === CONTINUE_DIALOG) {
      if (state.currentDialogIndex < state.dialogLength - 1) {
        const newDialogIndex = state.currentDialogIndex + 1
        const { dialogIndexMap } = state
        dialogIndexMap[newDialogIndex].visibleToUser = true
        state = dotProp.set(state, 'dialogIndexMap', dialogIndexMap)
        return dotProp.set(state, 'currentDialogIndex', newDialogIndex)
      }
      return state
    }

    if (action.type === JUMP_TO_DIALOG_PATH) {
      const { currentDialog, currentDialogIndex } = state
      let dialogPartIdIndex = currentDialogIndex
      // dialogIndexMap[currentDialogIndex]
      payload.currentDialog.map((dialogPart, index) => {
        if (dialogPart.dialogPartId === payload.dialogPartId) {
          dialogPartIdIndex = index
        }
      })

      // add dialogPartId to dialogParts that are visible to the user
      state = dotProp.set(state, 'dialogPathsVisibleToUser', [
        ...state.dialogPathsVisibleToUser,
        payload.dialogPartId
      ])
      // update currentDialogIndex
      return dotProp.set(state, 'currentDialogIndex', dialogPartIdIndex)
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
