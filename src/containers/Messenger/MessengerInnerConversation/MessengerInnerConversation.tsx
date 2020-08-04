import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useMessengerConversation } from 'containers/Messenger/useMessengerConversation'
import {
   updateConversationReadTime,
   updateConversationLocalReadTime,
} from 'redux_store/modules/messenger/messenger';

export default function MessengerInnerConversation(props) {
   const { active_conversation } = useSelector(state => state.messenger);
   const dispatch = useDispatch();
   const {
      ConversationBody,
      ConversationHeader,
   } = useMessengerConversation(active_conversation)

   React.useEffect(
      () => {
         dispatch(updateConversationLocalReadTime(active_conversation));

         return () => {
            dispatch(updateConversationReadTime(active_conversation));
         }
      },
      []
   )

   return (
      <React.Fragment>
         {ConversationHeader}
         {ConversationBody}
      </React.Fragment>
   )
}