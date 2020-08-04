import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'

export const GET_LATEST_USERS = gql`
   query GetLatestUsers {
      getLatestUsers {
         ...UserPublic
      }
   }
   ${UserFragments.public}
`