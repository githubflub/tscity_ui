import React from 'react'
import classnames from 'classnames'
import { useSelector, useDispatch } from 'react-redux';
import {
   joinRooms,
   ROOMS_SLIDE_MENU,
   openNonChatRoom,
   closeNonChatRoom,
   toggleNonChatRoomPayloadType
} from 'redux_store/modules/chat';

import './RoomTabs.scss'

function RoomTab(props) {
   const { room, active } = props;
   const dispatch = useDispatch();

   const onRoomTabClick = (event) => {
      event.preventDefault()

      if (room.id === 'rooms') {
         const payload: toggleNonChatRoomPayloadType = {
            name: ROOMS_SLIDE_MENU
         }

         dispatch(openNonChatRoom(payload))
      }
      else {
         const payload = {
            thread_ids: [],
            current_room: room.id,
         }

         dispatch(closeNonChatRoom());
         dispatch(joinRooms(payload));
      }
   }

   const tab_classname = classnames({
      'tscc_room_tab': true,
      'tscc_room_tab__active': !!active,
   })

   let styles = {}
   if (active) {
      styles = { fontWeight: 'bold' }
   }

   return (
      <div className={tab_classname} onClick={onRoomTabClick} style={styles}>{room.display_name}</div>
   )
}

export default function RoomTabs(props) {
   const { rooms } = props;

   const chat_state = useSelector(state => state.chat);
   const {
      open_rooms,
      current_room,
      selected_non_chat_room,
      non_chat_room_is_open,
   } = chat_state;

   const rooms_tab_is_open = non_chat_room_is_open && selected_non_chat_room === ROOMS_SLIDE_MENU

   const my_rooms = [
      {
         id: 'rooms',
         display_name: 'Rooms'
      }
   ]

   if (rooms) {
      const temp = rooms.filter(room => open_rooms.includes(room.id))
      temp.forEach(room => {
         my_rooms.push(room)
      })
   }

   return (
      <div className="tscc_room_tabs">
         {!rooms? null
            : my_rooms.map(room => {
               let room_is_active = !rooms_tab_is_open && room.id === current_room
               if (room.id === 'rooms') {
                  room_is_active = rooms_tab_is_open
               }
               return (
                  <RoomTab
                     key={room.id}
                     room={room}
                     active={room_is_active}
                  />
               )
            })
         }
      </div>
   )
}