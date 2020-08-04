import gql from 'graphql-tag'
import { ProfileFragments } from 'apollo/fragments/ProfileFragment'

export const UPDATE_PROFILE_MUTATION = gql`
   mutation UpdateProfile($body: ProfileInput!) {
      updateProfile(body: $body) {
         ...ProfilePublic
      }
   }
   ${ProfileFragments.public}
`