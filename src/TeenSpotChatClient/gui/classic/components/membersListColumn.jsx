import React from 'react'
import { useMembersList } from 'TeenSpotChatClient/hooks/useMembersList'
import UserPopper from 'TeenSpotChatClient/gui/shared/UserPopper/UserPopper'
import MembersListItem from './MembersListItem/MembersListItem'

function MembersListColumn(props) {
   const { room } = props;

   const total_users = ((room || {}).users_online || []).length

   return (
      <div className="membersListColumn">
         <div className="membersListTitleContainer">
            <div className="membersListTitle"><strong>{total_users} Members</strong></div>
         </div>
         <div className="membersListTextBoxContainer">
            <div className="membersListTextBox">
               {!room? null : room.users_online.map(user => <MembersListItem key={user.id} user={user} room={room} />)}
            </div>
         </div>
      </div>
   );
}

export default MembersListColumn;