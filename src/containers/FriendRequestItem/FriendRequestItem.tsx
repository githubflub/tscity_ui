import React from 'react'
import { BlockUserButton } from 'containers/BlockUserButton/BlockUserButton'
import Button from '@material-ui/core/Button'
import UserItem from 'components/UserItem/UserItem'

export default function FriendRequestItem(props) {
   const {
      friend_request,
      sender,
      loading,
      acceptFriendRequest,
      rejectFriendRequest,
      small,
      dark_mode,
      ...other
   } = props;

   return (
      <UserItem
         dark_mode={dark_mode}
         user={sender}
         right_side_items={
            <React.Fragment>
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
            </React.Fragment>
         }
         {...other}
      />

   )
}