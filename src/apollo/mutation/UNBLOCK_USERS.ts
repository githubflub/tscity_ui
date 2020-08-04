import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'

export const UNBLOCK_USERS = gql`
   mutation UnblockUsers($blocked_user_ids: [Int!]!) {
      unblockUsers(blocked_user_ids: $blocked_user_ids)
   }
`