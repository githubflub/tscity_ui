import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment';

export const SEARCH_USER = gql`
   query SearchUsers($search_term: String!) {
      searchUsers(search_term: $search_term) {
         ...UserPublic
      }
   }
   ${UserFragments.public}
`