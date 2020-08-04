import { WELCOME_MESSAGE } from 'redux_store/modules/chat/welcome_message'
import { writeSystemMessage } from './writeSystemMessage'
import { resetMessagesBeforeChatData } from 'redux_store/modules/chat'

export function moveInitialWelcomeMessage(options) {
   const { dispatch, getState } = options;

   const { chat: chat_state } = getState()

   // Check if welcome message is in pre chat_data storage
   if (chat_state.messages_before_chat_data
      && chat_state.messages_before_chat_data[0]
      && chat_state.messages_before_chat_data[0].system_message
      && chat_state.messages_before_chat_data[0].content === WELCOME_MESSAGE
   ) {
      // If so, move it!
      writeSystemMessage(WELCOME_MESSAGE, options, { write_to_beginning: true })
      dispatch(resetMessagesBeforeChatData());
   }
}