import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux'

const connectController = component => connect(mapStateToProps, mapDispatchToProps)(component)

export { connectController, mapStateToProps }
