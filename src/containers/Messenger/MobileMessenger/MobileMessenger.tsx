import React from 'react'
import { useSelector } from 'react-redux';
import MessengerInnerHub from '../MessengerInnerHub/MessengerInnerHub'
import MessengerInnerConversation from 'containers/Messenger/MessengerInnerConversation/MessengerInnerConversation'
import './MobileMessenger.scss'

export default function MobileMessenger(props) {
   const { active_conversation } = useSelector(state => state.messenger);

   // return active_conversation? <MessengerInnerConversation /> : <MessengerInnerHub />
   return (
      <div className="Messenger Messenger__dark Messenger__mobile MobileMessenger">
         {active_conversation? <MessengerInnerConversation /> : <MessengerInnerHub />}
      </div>
   )
}