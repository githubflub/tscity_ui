import React from 'react'
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import Button from '@material-ui/core/Button'
import { useFriendManager } from 'hooks/useFriendManager'
import UserItem from 'components/UserItem/UserItem'

export default function Friends(props) {
   const {
      args_friends,
      friendships,
      openRemoveFriendConfirmationDialog,
      RemoveFriendConfirmationDialog
   } = useFriendManager();
   const rows = friendships.map(friendship => (
      <UserItem
         user={friendship.user}
         right_side_items={
            <Button
               variant="contained"
               color="secondary"
               onClick={() => openRemoveFriendConfirmationDialog(friendship)}
            >
               {`Remove`}
            </Button>
         }
      />
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