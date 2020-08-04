import gql from 'graphql-tag'

export const GET_MY_BLOCKLIST = gql`
   query GetMyBlocklist {
      getMyBlockList
   }
`