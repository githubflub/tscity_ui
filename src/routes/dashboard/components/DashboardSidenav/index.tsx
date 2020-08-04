import React from 'react';
import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
import TSCardContentLight from 'components/TSCard/components/TSCardContentLight'
import TSCardContentVeryLight from 'components/TSCard/components/TSCardContentVeryLight';
import { Link } from 'react-router-dom'


export default function DashboardSidenav(props) {
   const nav_items = [
      <Link to='/dashboard/account'>Account</Link>,
      <Link to='/dashboard/profile'>Profile</Link>,
      <Link to='/dashboard/notifications'>Notifications</Link>,
      <Link to='/dashboard/friend_requests'>Friend Requests</Link>,
      <Link to='/dashboard/friend_requests_sent'>Friend Requests Sent</Link>,
      <Link to='/dashboard/friends'>Friends</Link>,
      <Link to='/dashboard/blocklist'>Blocklist</Link>,
   ]

   return (
      <TSCard color="blue">
         <TSCardHeader>Settings</TSCardHeader>
         {nav_items.map((item, i) => {
            const TSCardContent = i % 2 === 0? TSCardContentVeryLight : TSCardContentLight

            return <TSCardContent key={i}>{item}</TSCardContent>
         })}
      </TSCard>
   );
}