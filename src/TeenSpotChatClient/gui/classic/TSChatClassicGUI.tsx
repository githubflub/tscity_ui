import React from 'react'
import { useSelector } from 'react-redux'

// Import Components
import MembersListColumn from './components/membersListColumn.jsx'
import RoomColumn from './components/roomColumn.jsx'
import GrayButtons from './components/grayButtons.jsx'
import ChatInputArea from './components/mainChatInput';
import ChatLoginInput from './components/ChatLoginInput'
import RoomTabs from './components/RoomTabs/RoomTabs'
import RoomsRoom from './components/RoomsRoom/RoomsRoom'
import {
   ROOMS_SLIDE_MENU,
} from 'redux_store/modules/chat';


import './TSChatClassicGUI.scss'


function TeenSpotChatClient(props) {
   const { session, rooms } = props;
   const { login_status_checked, is_authenticated } = session;
   const {
      current_room,
      selected_non_chat_room,
      non_chat_room_is_open,
   } = useSelector(state => state.chat)

   let room_data;
   if (current_room) {
      room_data = rooms && rooms.find(room => room.id === current_room)
   }
   const rooms_tab_open = non_chat_room_is_open && selected_non_chat_room === ROOMS_SLIDE_MENU

   return (
      <div className="tsccCanvasOuter">
         <div className="tsccCanvasInner">
            <div id="LoggedIn">
               <div className="tsccRoomTabsRow">
                  <RoomTabs rooms={rooms} />
               </div>
               {rooms_tab_open? (
                     <RoomsRoom rooms={rooms} />
                  ) : (
                     <div className="roomAndMembersListRow">
                        <RoomColumn rooms={rooms} />
                        <MembersListColumn room={room_data} />
                     </div>
                  )
               }
               {login_status_checked && !rooms_tab_open? <ChatInputArea session={session} /> : null }

            </div>
         </div>
      </div>
   );
}

export default TeenSpotChatClient;