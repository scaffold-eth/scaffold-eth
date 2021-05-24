import dotProp from 'dot-prop-immutable'
import shortid from 'shortid'

// import { actionCreators as dialogsContainerActionCreators } from '../../../../../../../containers/dialogs/controller'

const stateContainerId = 'levels/underflow/levelContainerContent/createWalletWindow'

const initialState = {
  uniqueWindowId: shortid.generate()
}

const mapStateToProps = state => {
  const {
    underflowLevel: { createWalletWindow }
  } = state
  return {
    ...createWalletWindow
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

  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
