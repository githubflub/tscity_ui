import React from 'react'
import { useMembersList } from 'TeenSpotChatClient/hooks/useMembersList'
import UserPopper from 'TeenSpotChatClient/gui/shared/UserPopper/UserPopper'
import { username_styles } from 'TeenSpotChatClient/gui/shared/username_styles'
import { getUserPowerLevel } from 'utils/getUserPowerLevel'
import { badges } from 'TeenSpotChatClient/constants/badges'

export default function MembersListItem(props) {
   const { user, room } = props;
   const { setUserPopper } = useMembersList()

   // console.log("MembersListItem user", user);

   const user_power_level = getUserPowerLevel('thread', room.id, user);
   const style = {...username_styles[user_power_level] }
   const user_badge = badges[user_power_level];

   const onClick = (user) => {
      setUserPopper(user.username)
   }

   const anchor_ref = React.useRef(null);

   return (
      <React.Fragment key={user.id}>
         <div
            className="tsccMembersListItem"
            onClick={() => onClick(user)}
            ref={anchor_ref}
         >
            {user_badge && <img className="tscc_inline_badge" src={user_badge} />}
            <span style={style}>{user.display_name || user.username}</span>
         </div>
         <UserPopper anchorEl={anchor_ref.current} user={user}/>
      </React.Fragment>
   );
}
