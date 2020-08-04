import * as React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { teenspotSignOut } from 'redux_store/modules/session'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import classnames from 'classnames';
import { setMessengerHubIsOpen } from 'redux_store/modules/messenger/messenger';

import './BrandBar.scss'

export default function BrandBar() {
   const dispatch = useDispatch()
   const {
      args,
      user,
      friend_requests,
      message_notifications,
   } = useGetSelfQuery();

   let username = user.display_name || user.username || '';
   let numPrivateMessages = message_notifications.length;
   let newComments = 0;
   let newFriendRequests = friend_requests.length;

   const new_notif_class = 'teenspot_notification_bar__new_notification'

   return (
      <div className="teenspot_brand_bar">
         <div className="teenspot_brand_bar__top_half">
            <span className="teenspot_brand_bar__top_half_item"><strong>{username || 'Anon'}</strong></span>
            <Link className="teenspot_brand_bar__top_half_item" to={"/dashboard"}>Dashboard</Link>
            <Link className="teenspot_brand_bar__top_half_item" to={"/profiles/" + user.username}>View Your Profile</Link>
            <a className="teenspot_brand_bar__top_half_item" href="javascript:void(0)" onClick={() => dispatch(teenspotSignOut())}>Logout</a>
         </div>

         <div className="teenspot_notification_bar">
            <a
               className={classnames({ [new_notif_class]: numPrivateMessages > 0 })}
               href="javascript:void(0)"
               onClick={() => dispatch(setMessengerHubIsOpen(true))}
            >{numPrivateMessages} new</a> private {numPrivateMessages == 1 ? "message" : "messages"},{' '}
            <a className={newComments > 0 ? new_notif_class : ""}>{newComments} new</a> {newComments == 1? "comment" : "comments"},{' '}
            <Link className={newFriendRequests > 0 ? new_notif_class : ""} to={"/dashboard/friend_requests"}>{newFriendRequests} new</Link> friend {newFriendRequests == 1 ? "request" : "requests"}
         </div>
      </div>
   );
}