import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { TSChatClient } from './client/TSChatClient'
import TSChatClassicGUI from './gui/classic/TSChatClassicGUI'
import TSChatTwitchGUI from './gui/twitch/TSChatTwitchGUI'
import { useQuery } from 'apollo/apollo'
import { GET_CHAT_DATA_QUERY } from './graphql/query/getChatDataQuery'
import { useScreenSize } from 'hooks/useScreenSize'

import './gui/shared/TSCCSharedStyles.scss'

// Maybe do this one day, but too lazy for now.
// https://stackoverflow.com/a/52749848

// Explanation of the connection process.
// 1. Connect to WebSocket as soon as login_status is checked,
//    or new token is received.
// 2. Immediately make API request for chat history/list of chat rooms.
// 3. When API request and WebSocket connection are completed, join a room.
//
// 4. When the WebSocket connection is established, the API request will
//    be in 1 of 2 states, in progress or complete. If request is complete,
//    we can join chat rooms right away. If request is in progress, we set a
//    flag indicating that when API request completes, we need to join a room.

function TSChat(props) {
   const session = useSelector(state => state.session);
   const { id_token, login_status_checked } = session
   const [screen_width] = useScreenSize();
   const args = useQuery(GET_CHAT_DATA_QUERY)
   // console.log("GET CHAT DATA", args)

   // Runs on first render
   // And whenever API request completes.
   useEffect(
      () => {
         if (login_status_checked) {
            const connectToWebSocket = async () => {
               // Maybe awaiting this will prevent race conditions.
               // connect() is an async function after all.
               await TSChatClient.connect()
            }

            connectToWebSocket();

            return () => TSChatClient.disconnect()
         }
      },
      [login_status_checked, id_token]
   )


   let rooms
   let chat_settings
   if (args.data && args.data.listRooms) {
      rooms = args.data.listRooms
      chat_settings = args.data.getChatSettings
   }


   let client_gui = null;

   if (screen_width < TABLET_SIZE) {
      client_gui = (
         <TSChatTwitchGUI
            rooms={rooms}
         />
      )
   }
   else {
      client_gui = (
         <TSChatClassicGUI
            session={session}
            rooms={rooms}
            chat_settings={chat_settings}
         />
      )
   }


   return client_gui
}

export default TSChat