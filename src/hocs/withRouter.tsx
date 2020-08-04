import * as React from 'react'
import { withRouter as originalWithRouter } from 'react-router'
import { getParams } from 'route_tree/getParams'

export function withRouter(WrappedComponent) {
   const WithRouter = originalWithRouter(props => {

      const complete_path_params = getParams(props.location.pathname); 

      const new_props = {
         ...props,
         ...complete_path_params,
      }

      return <WrappedComponent {...new_props} /> 
   })

   return WithRouter;
}