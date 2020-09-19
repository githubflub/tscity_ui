import React from 'react'
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useDispatch } from 'react-redux'
import { getOppositeUser } from 'utils/getOppositeUser'
import { useSearch } from 'hooks/useSearch'
import { SearchKeys } from 'redux_store/modules/search/search'
import { SEARCH_USER } from 'apollo/query/SEARCH_USER'
import Badge from '@material-ui/core/Badge';
import {
   openConversation,
} from 'redux_store/modules/messenger/messenger'

export default function MessengerInnerHub(props) {
   const dispatch = useDispatch();

   const { user: self, dms, message_notifications } = useGetSelfQuery();

   const { SearchForm, search_results, search_input } = useSearch({
      query: SEARCH_USER,
      search_key: SearchKeys.messenger_hub,
      query_result_key: 'searchUsers',
      placeholder: "Search for a user...",
      dynamic: item => item.username,
   })

   const filtered_search_results = search_results
      .filter(user => {
         // We don't need to show users for whom
         // there is already a conversation.
         for (let i = dms.length - 1; i >= 0; i--) {
            const dm = dms[i];

            // Special case: handle self DMs
            if (user.id === self.id) {
               if (dm.access_users.length !== 1) {
                  continue;
               }
            }

            if (dm.access_users.includes(user.id)) {
               // console.log("Got someone!!!");
               return false;
            }
         }

         return true;
      })

   return (
      <React.Fragment>
         <div className="Messenger__border_bottom Messenger__input Messenger_SearchBox">{SearchForm}</div>
         <ChatScrollContainer no_stick hidden>
            {!dms.length
               ? (!filtered_search_results.length
                  ? <div style={{ textAlign: 'center' }}>{"No messages..."}</div>
                  : null)
               : dms.map(dm => {
                  const opposite_user = getOppositeUser(dm, self)
                  return (
                     <div
                        className="Messenger__border_bottom Messenger__HubItem Messenger__HubItem__clickable"
                        key={dm.id}
                        onClick={() => dispatch(openConversation({
                           thread_id: dm.id,
                           target_user_id: opposite_user.id,
                           target_username: opposite_user.username,
                           is_open: true,
                        }))}
                     >

                        {opposite_user.username} {message_notifications.includes(dm.id) && <span className="ts_notif_dot" />}
                     </div>
                  )
               })
            }
            {(() => {
               if (!filtered_search_results.length) return null

               return (
                  <React.Fragment>
                     <div
                        className="Messenger__border_bottom Messenger__HubItem"
                        style={{
                           textAlign: 'center',
                        }}
                     >
                        Search Results
                     </div>
                     {filtered_search_results
                        .map(user => {
                           // console.log("mapping user", user);
                           return (
                              <div
                                 className="Messenger__border_bottom Messenger__HubItem Messenger__HubItem__clickable"
                                 key={user.id}
                                 onClick={() => dispatch(openConversation({
                                    target_user_id: user.id,
                                    target_username: user.username,
                                    is_open: true,
                                 }))}
                              >
                                 {user.username}
                              </div>
                           )
                        })
                     }
                  </React.Fragment>
               )
            })()}
         </ChatScrollContainer>
      </React.Fragment>
   )
}