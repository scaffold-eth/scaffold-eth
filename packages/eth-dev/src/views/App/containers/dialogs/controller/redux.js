import dotProp from 'dot-prop-immutable'

import { prepareDialog } from './helpers'

// eslint-disable-next-line import/no-cycle
import levels from '../../../views/levels'

const initialLevel = 'intro'
const initialDialog = levels[initialLevel].dialog
const initialDialogPart = 'intro/start'

const stateContainerId = 'dialogs'

export const SET_DIALOG = `${stateContainerId}/SET_DIALOG`
export const JUMP_TO_DIALOG_PART = `${stateContainerId}/JUMP_TO_DIALOG_PART`
export const CONTINUE_DIALOG = `${stateContainerId}/CONTINUE_DIALOG`

const initialState = {
  currentDialog: prepareDialog(initialDialog),
  currentDialogIndex: 0,
  selectedDialogParts: [initialDialogPart]
}

const mapStateToProps = state => {
  const { dialogs } = state
  return {}
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    const { payload } = action

    if (action.type === SET_DIALOG) {
      state = dotProp.set(state, 'currentDialogIndex', 0)
      const dialogToBeSet = levels[payload.dialog].dialog
      const enrichedDialog = prepareDialog(dialogToBeSet)
      return dotProp.set(state, 'currentDialog', enrichedDialog)
    }

    if (action.type === JUMP_TO_DIALOG_PART) {
      console.log('JUMP_TO_DIALOG_PART')
      const { currentDialog, currentDialogIndex } = state
      let dialogPartIdIndex = currentDialogIndex
      currentDialog.map((dialogPart, index) => {
        console.log(dialogPart.dialogPartId, payload.dialogPartId)
        if (dialogPart.dialogPartId === payload.dialogPartId) {
          dialogPartIdIndex = index
        }
      })
      // add dialogPartId to selectedDialogParts
      state.selectedDialogParts.push(payload.dialogPartId)
      console.log({ selectedDialogParts: state.selectedDialogParts })
      // mark dialog with dialogPartId as visible
      state.currentDialog[dialogPartIdIndex].visibleToUser = true
      return dotProp.set(state, 'currentDialogIndex', dialogPartIdIndex)
    }

    if (action.type === CONTINUE_DIALOG) {
      if (state.currentDialogIndex < state.currentDialog.length - 1) {
        const newDialogIndex = state.currentDialogIndex + 1
        state.currentDialog[newDialogIndex].visibleToUser = true
        return dotProp.set(state, 'currentDialogIndex', newDialogIndex)
      }
      return state
    }

    return state
  }
  return state
}

const actionCreators = {
  setCurrentDialog: payload => ({
    type: SET_DIALOG,
    payload
  }),
  jumpToDialogPart: payload => ({
    type: JUMP_TO_DIALOG_PART,
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
  jumpToDialogPart: payload => {
    return actionCreators.jumpToDialogPart(payload)
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
    jumpToDialogPart(payload) {
      dispatch(actionCreators.jumpToDialogPart(payload))
    },
    continueDialog() {
      dispatch(actionCreators.continueDialog())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
