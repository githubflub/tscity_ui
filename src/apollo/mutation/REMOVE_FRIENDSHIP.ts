import gql from 'graphql-tag'
import { UserGroupFragments } from '@tscity/shared/graphql/fragments/UserGroupFragment'

export const REMOVE_FRIENDSHIP = gql`
   mutation RemoveFriendship($friendships: [UserGroupRemoveInput!]!) {
      removeFriends(friendships: $friendships) {
         id
      }
   }
`