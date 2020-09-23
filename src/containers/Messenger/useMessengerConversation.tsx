import React from 'react'
import { useDispatch } from 'react-redux';
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'
import BootstrapInput from 'components/BootstrapInput/BootstrapInput';
import { useMessengerInput } from 'hooks/Messenger/useMessengerInput'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useGetUserQuery } from 'apollo/hooks/useGetUserQuery'
import MessengerTab from './MessengerTab/MessengerTab'
import { useIsMobile } from 'hooks/useIsMobile'
import {
   deactivateConversation,
   closeConversation,
   updateCurrentInputValue,
} from 'redux_store/modules/messenger/messenger'
import HeaderCloseButton from 'components/HeaderCloseButton/HeaderCloseButton'

export function useMessengerConversation(item) {
   const dispatch = useDispatch();
   const is_mobile = useIsMobile();
   const { thread_id, target_user_id, target_username, is_open } = item;

   const {
      message_input,
      setMessageInput,
      onInputSubmit
   } = useMessengerInput(item);
   const { dms } = useGetSelfQuery();
   const { user: opposite_user } = useGetUserQuery({ /* id: target_user_id, */ username: target_username })
   const thread = thread_id? dms.find(t => t.id === thread_id) : null

   // Autofocus messenger input.
   const text_input = React.useRef(null);
   React.useEffect(
      () => {
         if (text_input.current && is_open) {
            text_input.current.focus();
         }
      },
      [is_open]
   )

   const onInputBlur = event => {
      dispatch(updateCurrentInputValue({ ...item, current_input_value: event.target.value }))
   }

   return {
      opposite_user,
      ConversationHeader: (
         <MessengerTab
            label={is_mobile
               ? <React.Fragment>
                  <HeaderCloseButton arrow onClick={() => dispatch(deactivateConversation())} />
                  <span>&nbsp;{opposite_user.username}</span>
               </React.Fragment>
               : opposite_user.username
            }
            onClose={is_mobile? null : () => dispatch(closeConversation(item))}
            className={is_mobile? "Messenger__border_bottom" : undefined}
         />
      ),
      ConversationBody: (
         <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ChatScrollContainer>
               <div style={{ padding: '5px 5px' }}>
                  {!thread? null : thread.messages.map(item => {
                     const display_name = item.sender.display_name || item.sender.username;
                     return (
                        <div
                           key={item.id}
                           className="Messenger_MessageItem"
                        >
                           <span className="Messenger_MessageItem_Username">{display_name}:&nbsp;</span>
                           <span className="Messenger_MessageItem_Content">{item.content}</span>
                        </div>
                     )
                  })}
               </div>
            </ChatScrollContainer>
            <div className="Messenger__input Messenger_SearchBox">
               <form onSubmit={onInputSubmit} autoComplete="off">
                  <BootstrapInput
                     placeholder="Say hello :)"
                     inputRef={text_input}
                     value={message_input.value || ''}
                     onChange={event => setMessageInput({ value: event.target.value })}
                     onBlur={onInputBlur}
                  />
               </form>
            </div>
         </div>
      )
   }
}