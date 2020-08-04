import React from 'react'
import { useSelector } from 'react-redux'
import { username_styles } from 'TeenSpotChatClient/gui/shared/username_styles';
import { getUserPowerLevel } from 'utils/getUserPowerLevel'
import { badges } from 'TeenSpotChatClient/constants/badges'


export function useChatRoom(rooms, gui_config) {
   const { MessageComponent } = gui_config;
   const chat_state = useSelector(state => state.chat);
   const { current_room, messages_before_chat_data } = chat_state;

   let room_data;
   let messages;
   let room_description = null;
   let total_room_users = 0;

   if (current_room && current_room !== 'rooms') {
      room_data = rooms && rooms.find(room => room.id === current_room)
      if (room_data) {
         messages = room_data.messages
         total_room_users = (room_data.users_online || []).length
      }
   }

   if (rooms) {
      if (current_room === 'rooms') {
         room_description = 'Rooms'
      }
      else if (current_room) {
         room_description = `${room_data.display_name} - ${room_data.description || ''}`
      }
   }



   const rendered_messages = (messages || []).map((message, i) => {
      // console.log("single message", message)
      if (!message.content || !MessageComponent) {
         return null;
      }

      const user_power_level = getUserPowerLevel('thread', message.thread_id, message.sender)
      const user_badge = badges[user_power_level];

      return (
         <MessageComponent
            key={`thread_${message.id? message.id : 'system_message'}_${i}`}
            badge={user_badge}
            message={message}
            styles={{
               username: { ...username_styles[user_power_level] }
            }}
         />
      )
   })

   return {
      messages,
      rendered_messages,
      total_room_users,
      room_data,
      current_room,
      room_description,
      messages_before_chat_data,
   }
}