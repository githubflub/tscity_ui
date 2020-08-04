import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'

export const GET_USER_QUERY = gql`
   query GetUser($username: String, $id: Int) {
      getUser(username: $username, id: $id) {
         ...UserPublic
      }
   }
   ${UserFragments.public}
`