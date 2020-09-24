import React from 'react'
import DraggablePopper from 'components/DraggablePopper/DraggablePopper';
import { useMembersList } from 'TeenSpotChatClient/hooks/useMembersList'
import UserTile from 'containers/UserTile/UserTile'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const UserPaper = withStyles({
   root: {
      backgroundColor: '#1f1f1f',
      color: 'rgba(255,255,255,0.88)',
      width: '100%',
      height: '195px',
   }
})(Paper);

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
         <UserPaper elevation={3}>
            <UserTile
               user={user}
               dark_mode
               always_wrapped
               onCloseClick={onCloseClick}
               style={{ width: '340px', padding: "10px" }}
            />
         </UserPaper>
      </DraggablePopper>
   )
}