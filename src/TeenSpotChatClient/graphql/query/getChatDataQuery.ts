import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'
import { MessageFragment } from '@tscity/shared/graphql/fragments/MessageFragment'

export const GET_CHAT_DATA_QUERY = gql`
   query {
      getChatSettings {
         user_id
         primary_room
         startup_rooms
         startup_no_room
      }

      listChatUsers {
         id
         username
      }

      listRooms {
         id
         display_name
         description
         access_users
         room
         enabled
         users_online {
            ...UserPublic
         }
         messages {
            ... on Message {
               ...MessageUser
            }
            ... on SystemMessage {
               system_message
               content
            }
         }
      }
   }
   ${UserFragments.public}
   ${MessageFragment.user}
`