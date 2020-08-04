import * as React from 'react'
import {
   Route,
   Switch,
} from 'react-router-dom';

import ProfileSearch from './containers/ProfilesSearch/ProfilesSearch'
import ProfileRoute from './routes/profile'

import 'layouts/AppLayout/AppLayout.scss'
import './styles/profileTemplateStyles.css';
import './styles/mobileProfileStyles.css';


function ProfilesRoute(props) {
   const { match } = props

   return (
      <Switch>
         <Route exact path={match.url} component={ProfileSearch} />
         <Route path={`${match.url}/:username`} component={ProfileRoute}/>
      </Switch>
   )
}

export default ProfilesRoute