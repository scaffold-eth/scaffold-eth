import dotProp from 'dot-prop-immutable'

const stateContainerId = 'levels/underflow/levelContainerContent'

const initialState = {}

const mapStateToProps = state => {
  const { dialogs, levels } = state
  return {
    dialogs,
    ...levels.underflow.terminalContent
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
  actions: {}
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
