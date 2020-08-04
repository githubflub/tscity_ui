import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom'

import { useIsMobile } from 'hooks/useIsMobile'

// Import subcomponents
import FriendRequests from './components/FriendRequests/FriendRequests'
import FriendRequestsSent from './components/FriendRequestsSent/FriendRequestsSent'
import Friends from './components/Friends/Friends'
import EditProfile from './components/EditProfile/EditProfile';
import EditAccount from './components/EditAccount/EditAccount';
import Notifications from './components/Notifications';
import YouNeedToBeLoggedIn from './components/YouNeedToBeLoggedIn';
import DashboardSidenav from './components/DashboardSidenav';
import BlockedUsers from './components/BlockedUsers/BlockedUsers'

// Import styles
import './Dashboard.scss';

export default function Dashboard(props) {
   const { match } = props;
   const { session } = useSelector(state => state);
   const is_mobile = useIsMobile();

   let content = null;
   if (session.is_authenticated == null) {
      content = null
   } else if (session.is_authenticated == false) {
      content = <YouNeedToBeLoggedIn/>;
   } else {
      const Routes = (
         <Switch>
            <Route exact path={match.url} component={is_mobile? DashboardSidenav : EditAccount} />
            <Route path={`${match.url}/profile`} component={EditProfile} />
            <Route path={`${match.url}/account`} component={EditAccount} />
            <Route path={`${match.url}/notifications`} component={Notifications} />
            <Route path={`${match.url}/friend_requests`} component={FriendRequests} />
            <Route path={`${match.url}/friend_requests_sent`} component={FriendRequestsSent} />
            <Route path={`${match.url}/friends`} component={Friends} />
            <Route path={`${match.url}/blocklist`} component={BlockedUsers} />
         </Switch>
      )

      content = (
         <div className="teenspot_app_layout__page">
            <div className="teenspot_app_layout__page_container">
               <div className="tsRow">
                  {is_mobile? (
                        <div id="contentCol" className="tsCol">
                           {Routes}
                        </div>
                     ) : (
                        <React.Fragment>
                           <div id="sidenavCol" className="tsCol">
                              <DashboardSidenav/>
                           </div>
                           <div style={{ width: '10px' }} />
                           <div id="contentCol" className="tsCol">
                              {Routes}
                           </div>
                        </React.Fragment>
                     )
                  }
               </div>
            </div>
         </div>
      );
   }

   return content;
}