import { useRoomsController } from './useRoomsController';

export function useRoomsRoom(rooms) {
   const { joinRoom } = useRoomsController(rooms);

   const onRoomRowDoubleClick = (event, room) => {
      event.preventDefault();
      joinRoom(room);
   }

   let rooms_room_name = `Rooms (${rooms? rooms.length : 0})`

   return {
      onRoomRowDoubleClick,
      rooms_room_name,
   }
}