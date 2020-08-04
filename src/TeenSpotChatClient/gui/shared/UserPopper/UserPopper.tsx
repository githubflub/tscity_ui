import React from 'react'
import DraggablePopper from 'components/DraggablePopper/DraggablePopper';
import { useMembersList } from 'TeenSpotChatClient/hooks/useMembersList'
import UserTile from 'containers/UserTile/UserTile'

export default function UserPopper(props) {
   const { anchorEl, user } = props;
   const { user_popper, setUserPopper } = useMembersList();

   const onCloseClick = () => {
      setUserPopper() //closes
   }

   return (
      <DraggablePopper
         id="user_popper"
         open={!!user_popper && !!anchorEl && user_popper === user.username}
         anchorEl={anchorEl}
         placement="bottom-end"
      >
         <UserTile user={user} onCloseClick={onCloseClick} style={{ width: '340px' }} />
      </DraggablePopper>
   )
}