import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'

export const BLOCK_USER = gql`
   mutation BlockUser($blocked_user_id: Int!) {
      addBlockedUser(blocked_user_id: $blocked_user_id) {
         ...UserPublic
      }
   }
   ${UserFragments.public}
`