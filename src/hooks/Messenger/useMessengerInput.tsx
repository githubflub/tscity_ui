import React, { useState } from 'react'
import { useMutation } from 'apollo/apollo'
import { validateMessage } from '@tscity/shared/utils/validateMessage'
import { SEND_DM } from '@tscity/shared/graphql/mutation/SEND_DM';
import { onReceiveDM } from 'amplify/iot/subtopic_handlers/onReceiveDM'
import { useDispatch, useSelector } from 'react-redux'

export function useMessengerInput(item) {
   const [message_input, setMessageInput] = useState({ value: item.current_input_value || '' })
   const { target_user_id, target_username } = item;
   const dispatch = useDispatch();
   const state = useSelector(state => state);

   const [
      sendDirectMessage,
      send_dm_result
   ] = useMutation(SEND_DM, {
      update(cache, response) {
         const { data: dumb } = response;
         const { sendDM } = dumb;
         const { thread, message } = sendDM;
         onReceiveDM({
            apollo_client: cache,
            dispatch,
            getState: () => state,
         }, { thread, message })
      }
   });

   const onInputSubmit = () => {
      event.preventDefault();
      try {
         const message = validateMessage(message_input.value);
         const options = {
            variables: {
               target_user_id: +target_user_id,
               content: message,
            }
         }

         sendDirectMessage(options);

         // Clear message input
         setMessageInput({ value: '' })

      } catch (error) {}
   }

   return {
      onInputSubmit,
      message_input,
      setMessageInput,
   }
}