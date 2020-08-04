import gql from 'graphql-tag'

export const friend_request_fragments = {
   main: gql`
      fragment FriendRequestMain on FriendRequest {
         id
      }
   `,
   get: gql`
      fragment FriendRequestGet on FriendRequest {
         id
         target_username
         sender_username
         target_user_id
         sender_user_id
         update_time
      }
   `
}