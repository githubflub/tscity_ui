import React from 'react'
import Button from '@material-ui/core/Button'
import { useFriendRequest } from 'hooks/useFriendRequest'
import { useSelector } from 'react-redux'
import { initial_state } from 'redux_store/modules/session'
import { isFriendOf } from 'utils/isFriendOf'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'

export default function AddFriendButton(props) {
   const { target } = props;
   const { args, user } = useGetSelfQuery();
   const {
      openFriendRequestConfirmationDialog,
      FriendRequestConfirmationDialog,
      create_friend_request_result,
   } = useFriendRequest(target);

   // I might have to move this logic out later...
   const { is_authenticated, identity }: typeof initial_state = useSelector(state => state.session);
   // no target, no button!
   if (!target) return null;
   if (!target.username) return null;

   // Unauthenticated users don't get to see this!
   if (!is_authenticated) return null;

   // Certainly can't friend yourself!
   if (!identity) return null;
   if (target.username === identity['cognito:username']) return null;

   // Can't friend people you're already friends with!
   if (isFriendOf(user, target)) return null;

   // console.log("create_friend_request_result", create_friend_request_result);
   const friend_request = (create_friend_request_result.data || {}).createFriendRequest

   return (
      <React.Fragment>
         {FriendRequestConfirmationDialog}
         <Button
            variant="contained"
            color="primary"
            onClick={openFriendRequestConfirmationDialog}
            disabled={create_friend_request_result.loading || !!friend_request}
         >
            {!!friend_request? `Friend request sent!` : create_friend_request_result.loading? `Adding...` : `Add as Friend`}
         </Button>
      </React.Fragment>
   )
}