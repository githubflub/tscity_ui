import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'

export const UPDATE_USER_MUTATION = gql`
   mutation UpdateUser($body: UserInput!) {
      updateUser(body: $body) {
         ...UserOwner
      }
   }
   ${UserFragments.owner}
`