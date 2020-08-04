import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'
import { User } from 'lib/schema/user/typedef'

export type GET_MY_BLOCKED_USERS_TYPE = {
   getMyBlockedUsers: User[]
}

export const GET_MY_BLOCKED_USERS = gql`
   query GetMyBlockedUsers($blocked_user_ids: [Int!]) {
      getMyBlockedUsers(blocked_user_ids: $blocked_user_ids) {
         ...UserPublic
      }
   }
   ${UserFragments.public}
`