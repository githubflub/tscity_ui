import gql from 'graphql-tag'
import { friend_request_fragments } from 'apollo/fragments/friend_request'


export const CREATE_FRIEND_REQUEST = gql`
   mutation CreateFriendRequest($target_username: String!) {
      createFriendRequest(target_username: $target_username) {
         ...FriendRequestGet
      }
   }
   ${friend_request_fragments.get}

`