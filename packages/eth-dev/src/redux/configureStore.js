import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './rootReducer'

export default function configureStore(initialState) {
  const middlewares = []

  // add dev middlewares
  if (process.env !== 'production') {
    const logger = createLogger({ collapsed: true })
    middlewares.push(logger)
  }

  const composeEnhancers =
    (process.env !== 'production' &&
      typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldHotReload: false })) ||
    compose

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
    // applyMiddleware(...middlewares)
  )

  /*
  if (process.env === 'development' && (module as any).hot) {
    (module as any).hot.accept('./rootReducer', () => {
      store.replaceReducer(require('./rootReducer').default)
    })
  }
  */

  return {
    ...store
    // close: () => store.dispatch(END)
  }
}
