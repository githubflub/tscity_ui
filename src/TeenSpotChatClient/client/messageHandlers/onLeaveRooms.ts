import { GET_CHAT_DATA_QUERY } from "TeenSpotChatClient/graphql/query/getChatDataQuery";

export function onLeaveRoomsMessage(tools, data) {
   const { apollo_client } = tools;
   // Remove user from user list
   // But only if there is a user to remove.
   if (data.payload.user && data.payload.user.id) {
      const chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY })

      let rooms_to_leave = data.action === 'leaverooms'? 'thread_ids' : 'subscribed_threads'

      apollo_client.writeQuery({
         query: GET_CHAT_DATA_QUERY,
         data: {
            ...chat_data,
            listRooms: chat_data.listRooms.map((room, i) => {
               if (!data.payload[rooms_to_leave].includes(room.id)) {
                  return room;
               }

               const updated_room = {
                  ...room,
                  users_online: chat_data.listRooms[i].users_online.filter(user => {
                     if (+user.id === +data.payload.user.id && user.username === data.payload.user.username) {
                        return false;
                     }

                     return true;
                  })
               }

               // console.log("quit updated_rooms", updated_room)

               return updated_room;
            })
         }
      })
   }
}