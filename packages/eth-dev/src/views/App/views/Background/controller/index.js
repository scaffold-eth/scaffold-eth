import { connect } from 'react-redux'
import { actionCreators, reducer, mapStateToProps, mapDispatchToProps } from './redux'

const connectController = component => connect(mapStateToProps, mapDispatchToProps)(component)

export { connectController, reducer, actionCreators, mapStateToProps, mapDispatchToProps }
