import React from 'react'
import { useSelector } from 'react-redux';
import './DesktopMessenger.scss'
import MessengerHub from '../MessengerHub/MessengerHub'
import MessengerConversation from '../MessengerConversation/MessengerConversation'

export default function DesktopMessenger(props) {
   const { open_conversations } = useSelector(state => state.messenger);

   return (
      <div className="Messenger DesktopMessenger">
         <div className="DesktopMessenger_inner">
            <MessengerHub />
            {!open_conversations
               ? null
               : open_conversations
                  .map(item => (
                     <MessengerConversation
                        key={`${item.target_user_id}`}
                        item={item}
                     />
                  ))
            }
         </div>
      </div>
   );
}