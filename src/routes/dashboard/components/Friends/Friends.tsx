import React from 'react'
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import Button from '@material-ui/core/Button'
import { useFriendManager } from 'hooks/useFriendManager'

export default function Friends(props) {
   const {
      args_friends,
      friendships,
      openRemoveFriendConfirmationDialog,
      RemoveFriendConfirmationDialog
   } = useFriendManager();
   const rows = friendships.map(friendship => (
      <div>
         <span>{friendship.user.username}</span>
         <Button
            variant="contained"
            color="secondary"
            onClick={() => openRemoveFriendConfirmationDialog(friendship)}
         >
            {`Remove`}
         </Button>
      </div>
   ))

   if (!rows.length) rows.push(args_friends.loading? "Loading friends..." : "No friends :(")

   return (
      <React.Fragment>
         {RemoveFriendConfirmationDialog}
         <EditRowsWithMobile
            title={`Friends`}
            color="green"
            rows={rows}
         />
      </React.Fragment>
   )
}