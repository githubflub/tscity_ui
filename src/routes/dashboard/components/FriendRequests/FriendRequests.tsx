import React from 'react'
import Button from '@material-ui/core/Button'
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useFriendRequests } from 'hooks/useFriendRequests'
import { BlockUserButton } from 'containers/BlockUserButton/BlockUserButton'
import FriendRequestItem from 'containers/FriendRequestItem/FriendRequestItem'

export default function FriendRequests(props) {
   const { args, user, friend_requests } = useGetSelfQuery();
   const {
      rejectFriendRequest,
      acceptFriendRequest,
      friend_requests_loading,
   } = useFriendRequests()

   const rows = friend_requests.map(friend_request => {
      const sender = {
         id: friend_request.sender_user_id,
         username: friend_request.sender_username,
      }

      return (
         <FriendRequestItem
            friend_request={friend_request}
            sender={sender}
            loading={friend_requests_loading}
            acceptFriendRequest={acceptFriendRequest}
            rejectFriendRequest={rejectFriendRequest}
         />
      )
   })

   if (!rows.length) {
      rows.push(args.loading? "Loading friend requests..." : "No Friend Requests :(")
   }

   return (
      <EditRowsWithMobile
         title="Friend Requests"
         color="green"
         rows={rows}
      />
   )
}