import React from 'react'
import { BlockUserButton } from 'containers/BlockUserButton/BlockUserButton'
import Button from '@material-ui/core/Button'

export default function FriendRequestItem(props) {
   const {
      friend_request,
      sender,
      loading,
      acceptFriendRequest,
      rejectFriendRequest,
      small,
      ...other
   } = props;


   return (
      <div
         {...other}
      >
         <span>{friend_request.sender_username}</span>
         <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={event => {
               event.stopPropagation();
               acceptFriendRequest(friend_request.id)
            }}
         >
            {`Accept`}
         </Button>
         <Button
            variant="contained"
            color="secondary"
            onClick={event => {
               event.stopPropagation();
               rejectFriendRequest(friend_request.id)
            }}
            disabled={loading}
         >
            {`No thanks`}
         </Button>
         <BlockUserButton user={sender} contained={small} />
      </div>
   )
}