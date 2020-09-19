import React from 'react'
import { useDispatch } from 'react-redux'
import MessengerSlider from '../MessengerSlider/MessengerSlider'
import {
   toggleConversationSlider,
} from 'redux_store/modules/messenger/messenger'
import { useMessengerConversation } from '../useMessengerConversation'
import { useUpdateReadTimeHook } from '../useUpdateReadTimeHook'

export default function MessengerConversation(props) {
   const dispatch = useDispatch();
   const { item } = props;
   const { is_open } = item;

   const {
      ConversationBody,
      ConversationHeader,
   } = useMessengerConversation(item)

   useUpdateReadTimeHook(item);

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