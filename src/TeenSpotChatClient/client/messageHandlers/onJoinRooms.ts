import { GET_CHAT_DATA_QUERY } from "TeenSpotChatClient/graphql/query/getChatDataQuery";
import { sortUsersOnline } from '../sortUsersOnline'

export function onJoinRooms(tools, data) {
   const { apollo_client } = tools;

   // Add user to threads
   // But only if there is a user to add.
   const chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY })

   apollo_client.writeQuery({
      query: GET_CHAT_DATA_QUERY,
      data: {
         ...chat_data,
         listRooms: chat_data.listRooms.map((room, i) => {
            if (!data.thread_ids.includes(room.id)) {
               // User hasn't joined this room, so leave it alone.
               return room;
            }

            // Add system join message
            const system_join_message = {
               content: `Now talking in ${room.display_name}`,
               system_message: true,
               __typename: 'SystemMessage',
            }

            const has_messages = !!chat_data.listRooms[i].messages.length

            const updated_room = {
               ...room,
               users_online: sortUsersOnline(data.room_data[room.id].users_online.map(dumb => ({ ...dumb, __typename: 'User' })), room.id),
               messages: (
                  has_messages?
                     [...chat_data.listRooms[i].messages]
                     :  [...data.room_data[room.id].messages.map(dumb => {
                              dumb.sender.groups = (dumb.sender.groups || []).map(item => ({ ...item, __typename: 'UserGroup' }))

                              return ({
                                 ...dumb,
                                 sender: { ...dumb.sender, __typename: 'MessageSenderType' },
                                 __typename: 'Message'
                              })
                           })
                        ]
               ),
            }

            if (data.origin_connection) {
               if (has_messages) {
                  updated_room.messages.push(system_join_message)
               }
               else {
                  updated_room.messages.unshift(system_join_message)
               }
            }

            console.log("joinRoom updated_room", updated_room)

            return updated_room;
         })
      }
   })
}