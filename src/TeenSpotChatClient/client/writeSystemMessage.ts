import { GET_CHAT_DATA_QUERY } from '../graphql/query/getChatDataQuery'
import { addMessagesBeforeChatData } from 'redux_store/modules/chat'

export type WriteSystemMessageFlagsType = {
   write_to_beginning?: boolean
}

export function writeSystemMessage(content, options, flags: WriteSystemMessageFlagsType = {}) {
   const { apollo_client, dispatch, getState } = options;

   const { chat: chat_state } = getState()

   // Create system message!
   const system_message = {
      content,
      system_message: true,
      __typename: 'SystemMessage',
      thread_id: undefined, // May be defined later.
   }


   // 1. Check status of chat data API request. Is it done or not?
   //    If it's done, that means data structure for storing messages
   //    is available. If it's not done, then I have to use the data
   //    structure in redux to store this message.

   // readQuery() only checks cache. Never tries to read from remote server!
   // Means this is a synchronous call. =)
   // Throws error if no data matching the given query is in the cache, meaning
   // the API request hasn't finished yet.
   let chat_data
   try {
      chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY });
   }
   catch (error) {
      // console.log("writeSystemMessage ERROR", error)
   }

   if (chat_data && chat_state.current_room) {
      // Chat data is available and we're in a room.
      // Assume API request completed,
      // write to graphql cache.

      // Message needs to belong to a room now.
      system_message.thread_id = chat_state.current_room

      apollo_client.writeQuery({
         query: GET_CHAT_DATA_QUERY,
         data: {
            ...chat_data,
            listRooms: chat_data.listRooms.map((room, i) => {
               if (room.id !== system_message.thread_id) {
                  return room;
               }

               const updated_room = {
                  ...room,
                  messages: flags.write_to_beginning?
                     [system_message, ...chat_data.listRooms[i].messages]
                     : [...chat_data.listRooms[i].messages, system_message]
               }

               return updated_room;
            })
         }
      })
   }

   else {
      // No chat data or not in a room yet. Write to redux.
      dispatch(addMessagesBeforeChatData([system_message]))
   }

}