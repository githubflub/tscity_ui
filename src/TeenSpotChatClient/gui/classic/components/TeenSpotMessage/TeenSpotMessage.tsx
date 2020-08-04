import React from 'react'
import system_chat_icon from 'assets/system_chat_icon.png'

import './TeenSpotMessage.scss'

export default function TeenSpotMessage(props) {
   const { message, styles, badge } = props;


   if (message.system_message) {
      return (
         <div className="tssc_chat_message">
            <img className="tscc_inline_badge" src={system_chat_icon} /><span className="tssc_chat_message__content">{message.content}</span>
         </div>
      );
   }

   const username = message.sender.display_name || message.sender.username || 'Unknown Player'

   return (
      <div className="tsscChatTextItem">
         {badge && <img className="tscc_inline_badge" src={badge} />}
         <span style={styles.username}>{`<${username}> `}</span>{message.content}
      </div>
   )
}