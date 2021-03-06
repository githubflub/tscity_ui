import React from 'react'
import Button from '@material-ui/core/Button'
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useFriendRequests } from 'hooks/useFriendRequests'
import UserItem from 'components/UserItem/UserItem'

export default function FriendRequestsSent(props) {
   const { args, user, friend_requests, friend_requests_sent } = useGetSelfQuery();
   const {
      rejectFriendRequest,
      unsendFriendRequest,
      acceptFriendRequest,
      friend_requests_loading,
   } = useFriendRequests()

   const rows = friend_requests_sent.map(friend_request => {
      return (
         <UserItem
            user={{
               username: friend_request.target_username,
            }}
            right_side_items={
               <Button
                  variant="contained"
                  color="primary"
                  disabled={friend_requests_loading}
                  onClick={() => unsendFriendRequest(friend_request.id)}
               >
                  {`Unsend`}
               </Button>
            }
         />
      )
   })

   if (!rows.length) {
      rows.push(args.loading? "Loading sent friend requests..." : "No friend requests sent")
   }

   return (
      <EditRowsWithMobile
         title="Friend Requests Sent"
         color="green"
         rows={rows}
      />
   )
}