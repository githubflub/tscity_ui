import gql from 'graphql-tag'
import { friend_request_fragments } from 'apollo/fragments/friend_request'

export const REJECT_FRIEND_REQUEST = gql`
   mutation RejectFriendRequest($friend_request_id: Int!) {
      rejectFriendRequest(friend_request_id: $friend_request_id) {
         ...FriendRequestMain
      }
   }
   ${friend_request_fragments.main}
`