import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './TSChatTwitchGUI.scss'
import BootstrapInput from 'components/BootstrapInput'
import { useChatRoom } from 'TeenSpotChatClient/hooks/useChatRoom'
import { useChatInput } from 'TeenSpotChatClient/hooks/useChatInput'
import { useLoginDialog } from 'hooks/useLoginDialog'
import TwitchMessage from 'TeenSpotChatClient/gui/twitch/components/TwitchMessage/TwitchMessage'
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'
import Filter1Icon from '@material-ui/icons/Filter1'
import TwitchUsersSlideMenu from './components/TwitchUsersSlideMenu/TwitchUsersSlideMenu'
import TwitchRoomsSlideMenu from './components/TwitchRoomsSlideMenu/TwitchRoomsSlideMenu'
import {
   toggleNonChatRoom,
   closeNonChatRoom,
   USERS_SLIDE_MENU,
   ROOMS_SLIDE_MENU,
} from 'redux_store/modules/chat'

export default function TSChatTwitchGUI(props) {
   const { rooms } = props;
   const dispatch = useDispatch();
   const {
      is_authenticated,
      login_status_checked,
   } = useSelector(state => state.session);
   const {
      selected_non_chat_room: selected_slide_menu,
      non_chat_room_is_open: slide_menu_open,
   } = useSelector(state => state.chat)

   const gui_config = {
      MessageComponent: TwitchMessage
   }
   const chat_data = useChatRoom(rooms, gui_config);
   const {
      current_room,
      room_description,
      room_data,
      rendered_messages,
      messages_before_chat_data,
   } = chat_data;
   const {
      message,
      setMessage,
      onInputSubmit,
      onChatInputBlur,
      chat_input_ref,
   } = useChatInput();

   const {
      openLoginDialog,
      LoginDialog,
      closeLoginDialog
   } = useLoginDialog();

   const onSlideMenuToggle = event => {
      event.preventDefault();
      const name = event.currentTarget.name;
      dispatch(toggleNonChatRoom({ name }))
   }

   const closeSlideMenu = event => {
      event.preventDefault();
      dispatch(closeNonChatRoom())
   }

   return (
      <div className="ts_twitch_chat">
         <div className="ts_twitch_chat__header_body">
            <div className="ts_twitch_chat__header">{(room_data && room_data.display_name) || <span>&nbsp;</span>}</div>
            <div className="ts_twitch_chat__body">
               <ChatScrollContainer>
                  {messages_before_chat_data.map((msg, i) => <TwitchMessage key={i} message={msg} />)}
                  {rendered_messages}
               </ChatScrollContainer>
            </div>
            <TwitchUsersSlideMenu
               open={slide_menu_open && selected_slide_menu === USERS_SLIDE_MENU}
               chat_data={chat_data}
               onClose={closeSlideMenu}
            />
            <TwitchRoomsSlideMenu
               open={slide_menu_open && selected_slide_menu === ROOMS_SLIDE_MENU}
               rooms={rooms}
               onClose={closeSlideMenu}
            />
         </div>

         <div className="ts_twitch_chat__footer">
            {!login_status_checked? null
               :  is_authenticated? (
                  <form className="ts_twitch_chat__input_form" onSubmit={onInputSubmit} autoComplete="off">
                     <BootstrapInput
                        className="ts_twitch_chat__input"
                        placeholder="Say hello :)"
                        // multiline
                        value={message.value || ''}
                        onChange={event => setMessage({ value: event.target.value })}
                        inputRef={chat_input_ref}
                        onBlur={onChatInputBlur}
                     />
                  </form>
               ) : (
                  <div className="ts_twitch_chat__input_form">
                     <Button
                        style={{ margin: 'auto', display: 'block' }}
                        variant="contained"
                        color="primary"
                        onClick={openLoginDialog}
                        disabled={false}
                     >
                        {'Log in to chat!'}
                     </Button>
                     {LoginDialog}
                  </div>
               )
            }

            <div className="ts_twitch_chat__footer_controls">
               <button
                  className="ts_twitch_chat__footer_control_button ts_button_div"
                  onClick={onSlideMenuToggle}
                  name={USERS_SLIDE_MENU}
                  title={USERS_SLIDE_MENU}
               >
                  <PeopleIcon />
               </button>
               <button
                  className="ts_twitch_chat__footer_control_button ts_button_div"
                  onClick={onSlideMenuToggle}
                  name={ROOMS_SLIDE_MENU}
                  title={ROOMS_SLIDE_MENU}
               >
                  <Filter1Icon />
               </button>
            </div>
         </div>
      </div>
   )
}