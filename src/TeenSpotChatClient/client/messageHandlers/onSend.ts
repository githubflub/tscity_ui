import { GET_CHAT_DATA_QUERY } from "TeenSpotChatClient/graphql/query/getChatDataQuery";

export function onSend(tools, data) {
   const { apollo_client } = tools;

   const chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY })
   data.sender.groups = (data.sender.groups || []).map(item => ({ ...item, __typename: 'UserGroup' }))

   const new_message = {
      ...data,
      sender: {
         ...data.sender,
         __typename: 'MessageSenderType',
      },
      __typename: 'Message',
   }

   apollo_client.writeQuery({
      query: GET_CHAT_DATA_QUERY,
      data: {
         ...chat_data,
         listRooms: chat_data.listRooms.map((room, i) => {
            if (room.id !== new_message.thread_id) {
               return room;
            }

            const updated_room = {
               ...room,
               messages: [...chat_data.listRooms[i].messages, new_message]
            }

            // console.log("sendMessage updated room", updated_room);

            return updated_room;
         })
      }
   })
}