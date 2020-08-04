import { useDispatch, useSelector } from 'react-redux'
import { joinRooms, leaveRooms } from 'redux_store/modules/chat';
import { TSChatClient } from 'TeenSpotChatClient/client/TSChatClient'

export function useRoomsController(rooms) {
   const dispatch = useDispatch();
   const chat_state = useSelector(state => state.chat);

   const joinRoom = (room) => {
      const rooms_to_join = [ room.id ];

      const payload = {
         thread_ids: rooms_to_join,
         current_room: room.id
      }

      dispatch(joinRooms(payload))

      // If the room is already open, we are probably
      // already subscribed to it and therefore don't
      // need to send another joinRooms request to
      // the server. NOTE: My server is smart enough
      // that I don't actually have to perform this
      // check, but it still prevents an unnecessary
      // network request, so it's worth it, right?
      if (!chat_state.open_rooms.includes(room.id)) {
         TSChatClient.joinRooms(rooms_to_join)
      }
   }

   const leaveRoom = (room_id) => {
      if (chat_state.open_rooms.length > 1) {
         const rooms_to_leave = [ room_id ]

         const payload = {
            thread_ids: rooms_to_leave,
         }

         dispatch(leaveRooms(payload))

         TSChatClient.leaveRooms(rooms_to_leave)
      }
   }

   let rooms_room_name = `Rooms (${rooms? rooms.length : 0})`

   return {
      joinRoom,
      leaveRoom,
      rooms_room_name,
   }
}