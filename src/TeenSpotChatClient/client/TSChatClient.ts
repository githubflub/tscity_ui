import ApolloClient, { QueryOptions } from 'apollo-client';
import { WebSocketClient } from './WebSocketClient'
import { writeConnectionEstablishedMessage } from './writeConnectionEstablishedMessage';
import { GET_CHAT_DATA_QUERY } from 'TeenSpotChatClient/graphql/query/getChatDataQuery';
import { joinRooms } from 'redux_store/modules/chat'
import { getRoomsToJoin } from './getRoomsToJoin'
import { sortUsersOnlineApollo } from './sortUsersOnline'
import { clearUnneededMessageHistory } from './clearUnneededMessageHistory'
import { moveInitialWelcomeMessage } from './moveInitialWelcomeMessage';
import { writeDisconnectedMessage } from './writeDisconnectedMessage';
import { parseWebSocketMessage } from 'utils/parseWebSocketMessage';
import { onSend } from './messageHandlers/onSend';
import { onJoinRooms } from './messageHandlers/onJoinRooms';
import { onLeaveRoomsMessage } from './messageHandlers/onLeaveRooms';
import { writeConnectingMessage } from './writeConnectingMessage';

type ChatClientTools = {
   apollo_client: ApolloClient<any>;
   dispatch: Function;
   getState: Function;
}

class TSChatClientClass extends WebSocketClient {
   private chat_data;
   private rooms_to_join;
   private tools: ChatClientTools;

   configure(tools: ChatClientTools) {
      this.tools = tools;
   }

   async onConnectAttempt() {
      const { apollo_client, dispatch } = this.tools;

      console.log("Making GQL request from ws client!!")
      const gql_request_options: QueryOptions = {
         query: GET_CHAT_DATA_QUERY,
      }
      this.chat_data = await apollo_client.query(gql_request_options)
      console.log("CHAT_DATA", this.chat_data);

      // At this point, we have the user's chat preferences.
      // Specifically, which room they want to join first.
      // We will join that room client-side now.
      this.rooms_to_join = getRoomsToJoin(this.tools, this.chat_data);
      await dispatch(joinRooms({
         thread_ids: this.rooms_to_join.rooms_to_join,
         current_room: this.rooms_to_join.current_room,
      }))

      // Need to sort users_online by power level.
      sortUsersOnlineApollo(this.tools, this.rooms_to_join.current_room);

      // The websocket will send me chat history.
      // For simplicity, I will only add that history
      // to local message storage if the local
      // message storage is empty. However, the API
      // request will provide history for all threads,
      // which will block the message history from
      // the websocket from ever being stored. My
      // solution for this is just to delete the message
      // history for those rooms/threads that the
      // user won't immediately join. (Ideally, I'd have
      // some kind of advanced merge function).
      clearUnneededMessageHistory(this.tools, this.rooms_to_join)
      writeConnectingMessage(this.tools);
   }

   onOpen() {
      writeConnectionEstablishedMessage(this.tools);

      // Need to join rooms!
      if (!!this.chat_data.data) {
         console.log("TSClient: WS join room");
         this.joinRooms(this.rooms_to_join.rooms_to_join);
      }

      // There's a 'Welcome to TS' message
      // that I have to move from pre chat_data storage
      // to post chat_data storage.
      moveInitialWelcomeMessage(this.tools);
   }

   onClose({ reconnect_delay }) {
      writeDisconnectedMessage(this.tools, reconnect_delay);
   }

   onMessage(event: MessageEvent) {
      // console.debug("WebSocket message received:", event);
      const data = parseWebSocketMessage(event)

      switch (data.action) {
         // We receive a chat message from the server
         case 'send':
            onSend(this.tools, data.payload);
            break
         case 'joinrooms':
            onJoinRooms(this.tools, data.payload);
            break
         case 'leaverooms':
         case 'quit':
            onLeaveRoomsMessage(this.tools, data);
            break
         default:
            return
      }
   }

   joinRooms(thread_ids) {
      const ws_message = {
         action: 'joinrooms',
         payload: {
            thread_ids,
         }
      }

      this.sendMessage(ws_message);
   }

   leaveRooms(thread_ids) {
      const ws_message = {
         action: 'leaverooms',
         payload: {
            thread_ids,
         }
      }

      this.sendMessage(ws_message);
   }

   sendChatMessage(content: string) {
      const cleaned_content = content.trim();

      if (!cleaned_content) {
         // Don't send empty messages;
         return;
      }

      if (this.tools) {
         const { getState } = this.tools

         const { chat: chat_state } = getState();

         if (chat_state.current_room) {
            const ws_message = {
               action: 'send',
               payload: {
                  content: cleaned_content,
                  thread_id: chat_state.current_room,
               }
            }

            this.sendMessage(ws_message);
         }
      }
   }
}

export const TSChatClient = new TSChatClientClass();