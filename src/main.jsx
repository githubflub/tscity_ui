import React from 'react'
import ReactDOM from 'react-dom'
import loadable from '@loadable/component'

const root_element = document.getElementById('app-root')

let render = () => {
   // Dynamically import our main App component, and render it
   const App = loadable(() => import(/* webpackChunkName: 'MainApp' */ './app'), {
      fallback: <div />
   })

   ReactDOM.render(
      <App />,
      root_element
   )
}

if (NODE_ENV !== 'production') {
   if (module.hot) {
      const renderApp = render;

      render = () => {
         try {
            renderApp()
         }
         catch(error) {
            console.error(error);
         }
      }

      module.hot.accept('./app', () => {
         setTimeout(render)
      })
   }
}

render();


