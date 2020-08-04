import React from 'react'
import system_chat_icon from 'assets/system_chat_icon.png'
import './TwitchMessage.scss'

export default function TwitchMessage(props) {
   const { message, styles, badge } = props

   if (message.system_message) {
      return (
         <div className="twitch_message">
            <img className="tscc_inline_badge" src={system_chat_icon} />
            <span className="twitch_message__content">{message.content}</span>
         </div>
      );
   }

   const username = message.sender.display_name || message.sender.username || 'Unknown Player'

   return (
      <div className="twitch_message">
         {badge && <img className="tscc_inline_badge" src={badge} />}
         <span style={styles.username} className="twitch_message__username">{username}</span>{': '}{message.content}
      </div>
   )
}