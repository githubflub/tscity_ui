import gql from 'graphql-tag'
import { friend_request_fragments } from 'apollo/fragments/friend_request'

export const ACCEPT_FRIEND_REQUEST = gql`
   mutation AcceptFriendRequest($friend_request_id: Int!) {
      acceptFriendRequest(friend_request_id: $friend_request_id) {
         ...FriendRequestMain
      }
   }
   ${friend_request_fragments.main}
`