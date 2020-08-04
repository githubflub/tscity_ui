import React, { useState } from 'react';
import { useRoomsRoom } from 'TeenSpotChatClient/hooks/useRoomsRoom'
import classnames from 'classnames'
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'

import './RoomsRoom.scss'

export default function RoomsRoom(props) {
   const { rooms } = props;
   const { onRoomRowDoubleClick, rooms_room_name } = useRoomsRoom(rooms);
   const [selected_room_id, setSelectedRoomId] = useState(false);

   const onRoomRowClick = (event, room) => {
      event.preventDefault();

      setSelectedRoomId(prev_room_id => {
         if (room.id === prev_room_id) {
            // This is the unselect case...
            return false
         }

         return room.id
      });
   }

   return (
      <div className="roomAndMembersListColumn">
         <div className="roomAndMembersListColumn_row">
            <div className="room_column_width">
               <div className="roomSubtitleBox">
                  {rooms_room_name}
               </div>
            </div>
            <div className="room_description_width">
               <div className="roomSubtitleBox">
                  Description
               </div>
            </div>
            <div className="room_members_width">
               <div className="roomSubtitleBox">
                  Members
               </div>
            </div>

         </div>
         <div className="roomAndMembersListColumn_row">
            <div className="room_column_width">
               <div className="tsscChatTextBox">
               </div>
            </div>
            <div className="room_description_width">
               <div className="tsscChatTextBox">
               </div>
            </div>
            <div className="rooms_table_div">
               <ChatScrollContainer
                  overlay
                  no_stick
                  render={args => {
                     const { scroll_is_showing } = args;



                     return (
                        <React.Fragment>
                           {rooms.map(room => {
                              const row_classname = classnames({
                                 "rooms_room__room_list_item": true,
                                 'rooms_room__room_list_item_active': room.id === selected_room_id,
                              })

                              return (
                                 <div
                                    key={room.id}
                                    onClick={event => onRoomRowClick(event, room)}
                                    onDoubleClick={event => onRoomRowDoubleClick(event, room)}
                                    className={row_classname}
                                 >
                                    <div className="room_column_width"><span style={{ paddingLeft: '5px' }}>{room.display_name}</span></div>
                                    <div className="rooms_room__column_spacer"></div>
                                    <div className="room_description_width"><span style={{ paddingLeft: '5px' }}>{room.description || ''}</span></div>
                                    <div className="rooms_room__column_spacer"></div>
                                    <div className="room_members_width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                       {(room.users_online || []).length}
                                       <span style={{ minWidth: scroll_is_showing? '17px' : '5px', minHeight: '1px' }}/>
                                    </div>
                                 </div>
                              )
                           })}
                        </React.Fragment>
                     )
                  }}

               />

            </div>
            <div className="room_members_width">
               <div className="tsscChatTextBox">
               </div>
            </div>
         </div>
      </div>
   )
}