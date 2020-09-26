import React from 'react';
import {
    Router,
} from 'react-router-dom';
import { Provider } from 'react-redux'
import ThemeProvider from '@material-ui/styles/ThemeProvider';
// import { ApolloProvider } from 'apollo-hooks/common/src/context/ApolloProvider'
import { ApolloProvider } from '@apollo/react-hooks'
import loadable from '@loadable/component'
import { createApolloClient } from './apollo'
import { createReduxStore } from './redux_store/createReduxStore'
import { setInitialLoginStatus } from 'redux_store/modules/session'
import { configureAmplify } from 'amplify/configure'
import { IoTListener } from 'amplify/iot/IoTListener'
import { createMaterialUiTheme } from 'stylesheets/createMaterialUiTheme'
import { TSChatClient } from 'TeenSpotChatClient/client/TSChatClient'
import single from 'webpack-hmr-singleton'

// Custom history with query support
import { createBrowserHistory } from "history";
import qhistory from 'qhistory'
import { stringify, parse } from 'qs'

const InnerApp = loadable(() => import(/* webpackChunkName: 'InnerAppComponent' */ './InnerApp'), {
   fallback: <div />
})


// Import Styles
import './stylesheets/teenspotStyles.scss'

export default function App(props) {
   // Initialize user authentication client library
   configureAmplify()

   // Custom history with query support
   const browser_history = qhistory(
      createBrowserHistory(),
      stringify,
      parse
   )

   // Initialize theme
   const theme = createMaterialUiTheme()

   // Initialize apollo client
   const apollo_client = createApolloClient()

   // Initialize local state management
   const store = createReduxStore(apollo_client)
   store.dispatch(setInitialLoginStatus())

   const tools = {
      dispatch: store.dispatch,
      getState: store.getState,
      apollo_client
   }

   // Initialize IoT listener?
   single(module, IoTListener.name, () => new IoTListener(tools))

   // Configure TSChatClient.
   TSChatClient.configure(tools)

   return (
      <ApolloProvider client={apollo_client}>
         <Provider store={store}>
            <Router history={browser_history}>
               <ThemeProvider theme={theme}>
                  <InnerApp />
               </ThemeProvider>
            </Router>
         </Provider>
      </ApolloProvider>
   );
}