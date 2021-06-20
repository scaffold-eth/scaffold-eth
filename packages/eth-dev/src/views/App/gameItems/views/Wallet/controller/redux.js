import dotProp from 'dot-prop-immutable'

const stateContainerId = 'wallet'

export const TOGGLE_VISIBLITY = `${stateContainerId}/TOGGLE_VISIBLITY`
export const WALLET_SHOW = `${stateContainerId}/WALLET_SHOW`
export const WALLET_HIDE = `${stateContainerId}/WALLET_HIDE`

const initialState = {
  walletVisible: false
}

const mapStateToProps = state => {
  const { wallet, terminal } = state
  return {
    ...wallet,
    terminal
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    switch (action.type) {
      case TOGGLE_VISIBLITY:
        return dotProp.set(state, 'walletVisible', !state.walletVisible)
      case WALLET_SHOW:
        return dotProp.set(state, 'walletVisible', true)
      case WALLET_HIDE:
        return dotProp.set(state, 'walletVisible', false)
      default:
        return state
    }
  }
  return state
}

const actionCreators = {
  toggleWalletVisibility: () => ({
    type: TOGGLE_VISIBLITY
  }),
  showWallet: () => ({
    type: WALLET_SHOW
  }),
  hideWallet: () => ({
    type: WALLET_HIDE
  })
}

const dispatchers = {
  toggleWalletVisibility: () => {
    return actionCreators.toggleWalletVisibility()
  },
  showWallet: () => {
    return actionCreators.showWallet()
  },
  hideWallet: () => {
    return actionCreators.hideWallet()
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleWalletVisibility() {
      dispatch(actionCreators.toggleWalletVisibility())
    },
    showWallet() {
      dispatch(actionCreators.showWallet())
    },
    hideWallet() {
      dispatch(actionCreators.hideWallet())
    }
  }
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
