import gql from 'graphql-tag'
import { ProfileFragments } from 'apollo/fragments/ProfileFragment'

export const GET_PROFILE_QUERY = gql`
   query GetProfile($username: String) {
      getProfile(username: $username) {
         ...ProfilePublic
      }
   }
   ${ProfileFragments.public}
`