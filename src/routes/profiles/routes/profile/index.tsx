import * as React from 'react'
import {
   Route,
   Switch,
} from 'react-router-dom';
import { useGetUserQuery } from 'apollo/hooks/useGetUserQuery'

import NotFound from 'containers/NotFound/NotFound'
import Profile from './containers/Profile/Profile'

import 'layouts/AppLayout/AppLayout.scss'


function ProfileRoute(props) {
   const { match } = props
   // console.log("tru match", match)
   const username = match.params.username
   const { args } = useGetUserQuery({ username })
   // console.log("ProfileRoute args", args);

   if (args.error) {
      return (
         <NotFound />
      )
   }

   return (
      <Switch>
         <Route exact path={match.url} component={Profile} />
      </Switch>
   )
}

export default ProfileRoute