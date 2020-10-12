import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

// Import actions

import rootReducer from './modules'
import {
   ApolloClient,
   NormalizedCacheObject
} from 'apollo/apollo'

export function createReduxStore(apollo_client: ApolloClient<NormalizedCacheObject>) {
   const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
   const store = createStore(
      rootReducer,
      {},
      composeEnhancers(
         applyMiddleware(thunk.withExtraArgument({ apollo_client }))
      )
   );

   // Set up HMR
   if (NODE_ENV !== 'production') {
      if (module.hot) {
         module.hot.accept('./modules', () => {
            const new_reducer = require('./modules').default;
            store.replaceReducer(new_reducer)
         })
      }
   }

   return store
}