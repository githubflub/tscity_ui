import { GET_CHAT_DATA_QUERY } from '../graphql/query/getChatDataQuery'

export function clearUnneededMessageHistory(options, data) {
   const { apollo_client } = options
   const rooms_to_join = data.rooms_to_join;

   const chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY });

   apollo_client.writeQuery({
      query: GET_CHAT_DATA_QUERY,
      data: {
         ...chat_data,
         listRooms: chat_data.listRooms.map((room, i) => {
            if (rooms_to_join.includes(room.id)) {
               return room;
            }

            const updated_room = {
               ...room,
               messages: [] // Clear messages
            }

            return updated_room;
         })
      }
   })
}