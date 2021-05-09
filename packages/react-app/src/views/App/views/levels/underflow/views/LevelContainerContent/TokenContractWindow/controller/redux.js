import dotProp from 'dot-prop-immutable'
import shortid from 'shortid'

import { actionCreators as dialogsContainerActionCreators } from '../../../../../../../containers/dialogs/controller'

const stateContainerId = 'levels/underflow/levelContainerContent/tokenContractWindow'

const initialState = {
  uniqueWindowId: shortid.generate()
}

const mapStateToProps = state => {
  const {
    underflowLevel: { tokenContractWindow }
  } = state
  return {
    ...tokenContractWindow
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    switch (action.type) {
      default:
        return state
    }
  }
  return state
}

const actionCreators = {}

const dispatchers = {}

const mapDispatchToProps = dispatch => ({
  actions: {
    continueDialog() {
      dispatch(dialogsContainerActionCreators.continueDialog())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
