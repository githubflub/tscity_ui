import gql from 'graphql-tag'
import { UserGroupFragments } from '@tscity/shared/graphql/fragments/UserGroupFragment'
import { UserGroup } from 'lib/schema/UserGroup/typedef'

// Ugh this is so dumb.
export type GET_MY_FRIENDS_QUERY_TYPE = {
   getMyFriends: UserGroup[]
}

export const GET_MY_FRIENDS_QUERY = gql`
   query GetMyFriends {
      getMyFriends {
         ...UserGroupMain
         user {
            id
            username
            display_name
         }
      }
   }
   ${UserGroupFragments.main}
`