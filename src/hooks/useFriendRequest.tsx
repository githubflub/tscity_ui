import React from 'react'
import Button from '@material-ui/core/Button'
import { useMutation } from 'apollo/apollo'
import { CREATE_FRIEND_REQUEST } from 'apollo/mutation/CREATE_FRIEND_REQUEST'
import { useDialog } from 'hooks/useDialog'
import { createFriendRequestMutationUpdater } from 'hooks/FriendRequest/createFriendRequestMutationUpdater'


export function useFriendRequest(target) {
   const {
      openDialog,
      closeDialog,
      createDialog,
   } = useDialog()

   const [
      createFriendRequest,
      create_friend_request_result
   ] = useMutation(CREATE_FRIEND_REQUEST, {
      update: createFriendRequestMutationUpdater('createFriendRequest', 'getMySentFriendRequests', 'unshift')
   })

   const target_display_name = target.display_name || target.username || 'this person'

   const sendFriendRequest = () => {
      const query = {
         variables: {
            target_username: target.username,
         }
      }

      createFriendRequest(query);
      closeDialog();
   }

   return {
      openFriendRequestConfirmationDialog: openDialog,
      closeFriendRequestConfirmationDialog: closeDialog,
      create_friend_request_result,
      FriendRequestConfirmationDialog: createDialog(
         <div>
            <p>{`Add ${target_display_name} as a friend?`}</p>
            <Button
               variant="contained"
               color="primary"
               onClick={sendFriendRequest}
            >Add Friend</Button>
            <Button
               variant="contained"
               color="secondary"
               onClick={closeDialog}
            >Cancel</Button>
         </div>
      ),
   }
}