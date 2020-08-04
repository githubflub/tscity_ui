import React from 'react'
import { useDispatch } from 'react-redux';
import MessengerSlider from '../MessengerSlider/MessengerSlider'
import {
   toggleConversationSlider,
   updateConversationLocalReadTime,
   updateConversationReadTime
} from 'redux_store/modules/messenger/messenger'
import { useMessengerConversation } from '../useMessengerConversation'

export default function MessengerConversation(props) {
   const dispatch = useDispatch();
   const { item } = props;
   const { is_open } = item;

   const {
      ConversationBody,
      ConversationHeader,
   } = useMessengerConversation(item)

   React.useEffect(
      () => {
         if (is_open) {
            dispatch(updateConversationLocalReadTime(item))
         }

         return () => {
            if (is_open) {
               dispatch(updateConversationReadTime(item))
            }
         }
      },
      [is_open]
   )

   return (
      <MessengerSlider
         use_outside_state
         style={{ width: '250px' }}
         is_open={is_open}
         onTabClick={() => dispatch(toggleConversationSlider(item))}
         PullTab={ConversationHeader}
         WithRespectTo={ConversationBody}
      />
   )
}