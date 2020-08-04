import gql from 'graphql-tag'

export const UPDATE_THREAD_READ_TIME = gql`
   mutation UpdateThreadReadTime($thread_id: Int!) {
      updateThreadReadTime(thread_id: $thread_id) {
         thread_id
         user_id
         timestamp
      }
   }
`