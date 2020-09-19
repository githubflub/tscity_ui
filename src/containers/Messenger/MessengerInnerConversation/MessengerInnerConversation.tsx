import React from 'react'
import { useSelector } from 'react-redux';
import { useMessengerConversation } from 'containers/Messenger/useMessengerConversation'
import { useUpdateReadTimeHook } from '../useUpdateReadTimeHook'

export default function MessengerInnerConversation(props) {
   const { active_conversation } = useSelector(state => state.messenger);
   const {
      ConversationBody,
      ConversationHeader,
   } = useMessengerConversation(active_conversation)

   useUpdateReadTimeHook(active_conversation);

   return (
      <React.Fragment>
         {ConversationHeader}
         {ConversationBody}
      </React.Fragment>
   )
}