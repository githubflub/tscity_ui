import gql from 'graphql-tag'
import { friend_request_fragments } from 'apollo/fragments/friend_request'

export const UNSEND_FRIEND_REQUEST = gql`
   mutation UnsendFriendRequest($friend_request_id: Int!) {
      unsendFriendRequest(friend_request_id: $friend_request_id) {
         ...FriendRequestMain
      }
   }
   ${friend_request_fragments.main}
`