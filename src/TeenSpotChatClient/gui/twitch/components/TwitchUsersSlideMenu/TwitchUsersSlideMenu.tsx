import React, { useState } from 'react'
import TwitchSlideMenu from '../TwitchSlideMenu/TwitchSlideMenu'
import BootstrapInput from 'components/BootstrapInput'
import { isWebmaster } from 'utils/isWebmaster'
import { username_styles } from 'TeenSpotChatClient/gui/shared/username_styles';


export default function TwitchUsersSlideMenu(props) {
   const { open, onClose, chat_data } = props
   const [user_search, setUserSearch] = useState({ value: '' })

   const {
      total_room_users,
      room_data,
   } = chat_data;

   const onUserSearchSubmit = event => {
      event.preventDefault();
   }

   const trimmed_search_value = user_search.value.trim().toLowerCase();
   const filtered_users = !room_data? [] : room_data.users_online.filter(user => {
      if (user.username.toLowerCase().includes(trimmed_search_value)) {
         return true;
      }

      return false;
   })

   const renderTitle = () => {
      let title = `Users (${total_room_users})`
      if (user_search.value.trim()) {
         title = `Users (${filtered_users.length} of ${total_room_users})`
      }

      return <h3>{title}</h3>
   }

   return (
      <TwitchSlideMenu
         open={open}
         onClose={onClose}
         title={renderTitle()}
      >
         <div>
            <form className="ts_twitch_chat__input_form" onSubmit={onUserSearchSubmit}>
               <BootstrapInput
                  className="ts_twitch_chat__input"
                  placeholder="Search Users..."
                  value={user_search.value || ''}
                  onChange={event => setUserSearch({ value: event.target.value })}
               />
            </form>
            <div style={{ padding: '8px' }}>
               {filtered_users.map(user => {
                     return (
                        <div
                           key={user.id}
                           style={isWebmaster(user)? { ...username_styles.webmaster } : {}}
                        >
                           {user.username}
                        </div>
                     )
                  })
               }
            </div>
         </div>
      </TwitchSlideMenu>
   );
}