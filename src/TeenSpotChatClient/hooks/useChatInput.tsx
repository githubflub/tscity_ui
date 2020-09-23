import React from 'react'
import { TSChatClient } from 'TeenSpotChatClient/client/TSChatClient'
import { validateMessage } from '@tscity/shared/utils/validateMessage'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentInputValue } from 'redux_store/modules/chat'

export function useChatInput() {
   const dispatch = useDispatch()
   const { current_input_value } = useSelector(state => state.chat)
   const [message, setMessage] = React.useState({ value: current_input_value || '' })
   const chat_input_ref = React.useRef(null);

   const onInputSubmit = (event) => {
      event.preventDefault();
      try {
         const validated_message = validateMessage(message.value);
         TSChatClient.sendChatMessage(validated_message)

         // Clear message input
         setMessage({ value: '' })
      } catch (error) {}
   }

   const onChatInputBlur = event => {
      // console.log("Input is blurring with this value...", event.target.value)
      dispatch(updateCurrentInputValue({ current_input_value: event.target.value }))
   }

   React.useEffect(
      () => {
         if (chat_input_ref.current) {
            chat_input_ref.current.focus()
         }
      },
      []
   )

   return {
      message,
      setMessage,
      onInputSubmit,
      chat_input_ref,
      onChatInputBlur,
   }
}