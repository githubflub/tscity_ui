import React from 'react'
import { useChatRoom } from 'TeenSpotChatClient/hooks/useChatRoom'
import TeenSpotMessage from 'TeenSpotChatClient/gui/classic/components/TeenSpotMessage/TeenSpotMessage'
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'
import { useRoomsController } from 'TeenSpotChatClient/hooks/useRoomsController'



function tsccRoomColumn(props) {
   const { rooms } = props;
   const gui_config = {
      MessageComponent: TeenSpotMessage
   }
   const {
      messages,
      current_room,
      room_description,
      rendered_messages,
      messages_before_chat_data,
   } = useChatRoom(rooms, gui_config);

   const {
      leaveRoom
   } = useRoomsController(rooms)

   const onCloseButtonClick = () => {
      leaveRoom(current_room)
      // console.log("You clicked the close button!");
   }

   return (
      <div className="roomColumn">
         <div className="roomSubtitleContainer">
            <div className="roomSubtitleBox">
               <span className="roomSubtitleBox__description">{room_description}</span>
               <button className="roomSubtitleBox__close ts_button_div" onClick={onCloseButtonClick}>Close</button>
            </div>
         </div>
         <div className="tsscChatTextBoxContainer">
            <div className="tsscChatTextBox">
               {current_room === 'rooms'? null
                  :  <ChatScrollContainer>
                        {messages_before_chat_data.map((msg, i) => <TeenSpotMessage key={i} message={msg} />)}
                        {rendered_messages}
                     </ChatScrollContainer>
               }
            </div>
         </div>
      </div>
   );
}

export default tsccRoomColumn;