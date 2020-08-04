import { useState } from 'react'
import { TSChatClient } from 'TeenSpotChatClient/client/TSChatClient'
import { validateMessage } from '@tscity/shared/utils/validateMessage'

export function useChatInput() {
   const [message, setMessage] = useState({ value: '' })

   const onInputSubmit = (event) => {
      event.preventDefault();
      try {
         const validated_message = validateMessage(message.value);
         TSChatClient.sendChatMessage(validated_message)

         // Clear message input
         setMessage({ value: '' })
      } catch (error) {}

   }

   return {message, setMessage, onInputSubmit}
}