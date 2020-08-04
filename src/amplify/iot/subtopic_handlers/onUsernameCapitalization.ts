import { GET_CHAT_DATA_QUERY } from "TeenSpotChatClient/graphql/query/getChatDataQuery";

export function onUsernameCapitalization(tools, data) {
   const { apollo_client, getState } = tools;
   const { chat: chat_state } = getState();
   const open_rooms = chat_state.open_rooms;

   // Throws an error if query not in cache.
   let chat_data;
   try {
      chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY });
   }
   catch (error) {
      // Assume query wasn't in the cache.
      // Meaning there's nothing to update.
      return;
   }

   apollo_client.writeQuery({
      query: GET_CHAT_DATA_QUERY,
      data: {
         ...chat_data,
         listRooms: chat_data.listRooms.map((room, i) => {
            if (open_rooms.includes(room.id)) {
               const updated_room = {
                  ...room,
                  users_online: room.users_online.map(user => {
                     if (user.username === data.username) {
                        return {
                           ...user,
                           display_name: data.display_name
                        }
                     }

                     return user;
                  })
               }

               return updated_room;
            }

            return room;
         })
      }
   })
}