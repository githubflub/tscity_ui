import React from 'react'
import TwitchSlideMenu from '../TwitchSlideMenu/TwitchSlideMenu'
import { useRoomsRoom } from 'TeenSpotChatClient/hooks/useRoomsRoom';
import './TwitchRoomsSlideMenu.scss'


export default function TwitchUsersSlideMenu(props) {
   const { open, onClose, rooms } = props


   const { onRoomRowDoubleClick, rooms_room_name } = useRoomsRoom(rooms);

   const renderTitle = () => {
      let title = rooms_room_name

      return <h3>{title}</h3>
   }

   return (
      <TwitchSlideMenu
         open={open}
         onClose={onClose}
         title={renderTitle()}
      >
         <div className="TwitchRoomsSlideMenu">
            {(rooms || []).map(room => {
               return (
                  <div key={room.id} className="TwitchRoomsSlideMenu_row" onClick={event => onRoomRowDoubleClick(event, room)} style={{ display: 'flex' }}>
                     <div style={{ flex: 2 }}>{room.display_name}</div>
                     <div style={{ flex: 4 }}>{room.description || '' }</div>
                     <div style={{ flex: 1 }}>{(room.users_online || []).length}</div>
                  </div>
               )
            })}
         </div>
      </TwitchSlideMenu>
   );
}