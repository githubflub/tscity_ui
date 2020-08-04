// Read's user's chat settings and gets
// which rooms they want to join when
// chat starts up
// and which room they want open on their screen
// first...

// UNLESS there are already values in redux?

export function getRoomsToJoin(options, chat_data, use_redux_store = true) {
   console.log("getRoomsToJoin: Getting rooms to join!")
   let rooms_to_join
   let current_room
   let redux_store_has_been_used = false;

   const { getState } = options;

   if (use_redux_store) {
      const { chat: chat_state } = getState()

      // This condition is a way to tell if the
      // store has been set. I think current_room
      // is always defined (or null) after the
      // chat store has been touched.
      if (chat_state.current_room !== undefined) {
         rooms_to_join = [ ...new Set(chat_state.open_rooms) ]
         current_room = chat_state.current_room;
         redux_store_has_been_used = true;
      }
   }

   // If redux store has not been used,
   // get rooms to join from chat settings.
   if (!redux_store_has_been_used) {
      const chat_settings = chat_data.data.getChatSettings
      rooms_to_join = [].concat(chat_settings.startup_rooms);

      if (chat_settings.primary_room && chat_settings.primary_room !== 'rooms') {
         current_room = chat_settings.primary_room
         rooms_to_join.push(chat_settings.primary_room)
      }

      rooms_to_join = [ ...new Set(rooms_to_join) ]
   }


   console.log("rooms_to_join", rooms_to_join)
   const result = {
      rooms_to_join,
      current_room
   }

   return result
}