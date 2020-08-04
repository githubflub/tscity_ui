import gql from 'graphql-tag'

export const ProfileFragments = {
   public: gql`
      fragment ProfilePublic on Profile {
         id
         user_id
         username
         visibility
         about_me
      }
   `
}