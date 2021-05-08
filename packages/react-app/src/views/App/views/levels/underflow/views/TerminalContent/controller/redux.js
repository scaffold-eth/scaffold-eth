import dotProp from 'dot-prop-immutable'

import { actionCreators as levelContainerActionCreators } from '../../../../../LevelContainer/controller'

import dialog from '../../../model/dialog'

const stateContainerId = 'levels/underflowLevel/terminalContent'

export const CONTINUE_DIALOG = `${stateContainerId}/CONTINUE_DIALOG`

const initialState = {
  dialog,
  currentDialogIndex: 0
}

const mapStateToProps = state => {
  const { underflowLevel } = state
  return {
    ...underflowLevel.terminalContent
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    switch (action.type) {
      case CONTINUE_DIALOG:
        if (state.currentDialogIndex < state.dialog.length - 1) {
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
  continueDialog: () => ({
    type: CONTINUE_DIALOG
  })
}

const dispatchers = {
  continueDialog: () => {
    return actionCreators.continueDialog()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    continueDialog() {
      dispatch(actionCreators.continueDialog())
    },
    startCityLevel() {
      dispatch(levelContainerActionCreators.setCurrentLevel('overflow')) // TODO: import string from constants list
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
