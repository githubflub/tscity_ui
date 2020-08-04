import { parseWebSocketMessage } from 'utils/parseWebSocketMessage'
import ApolloClient, { QueryOptions } from 'apollo-client';
import { GET_CHAT_DATA_QUERY } from '../graphql/query/getChatDataQuery'
import { getIdentityToken } from 'amplify/getIdentityToken';
import { writeConnectingMessage } from './writeConnectingMessage'
import { writeConnectionEstablishedMessage } from './writeConnectionEstablishedMessage'
import { writeDisconnectingMessage } from './writeDisconnectingMessage'
import { writeDisconnectedMessage } from './writeDisconnectedMessage'
import { moveInitialWelcomeMessage } from './moveInitialWelcomeMessage'
import { joinRooms } from 'redux_store/modules/chat'
import { getRoomsToJoin } from './getRoomsToJoin'
import { clearUnneededMessageHistory } from './clearUnneededMessageHistory'
import { sortUsersOnlineApollo } from './sortUsersOnline'
import { USE_LOCAL_WS_LAMBDA, getWebsocketEndpoint } from 'utils/getEndpoint'
import { RetryAgent } from 'utils/RetryAgent'
import { KeepAliveAgent } from 'utils/KeepAliveAgent'
import { onSend } from './messageHandlers/onSend'
import { onJoinRooms } from './messageHandlers/onJoinRooms'
import { onLeaveRoomsMessage } from './messageHandlers/onLeaveRooms'

// AWS closes WebSocket connections after 10 minutes. (Can't change)
// AWS doesn't allow connections longer than 2 hours. (Can't change)
// I've implemented retry behavior...

interface TeenSpotChatClientOptions {
   apollo_client: ApolloClient<any>
   dispatch: Function
}

let ws: WebSocket = undefined;
let config = undefined;
let reconnect_on_close = true;
let request_queue = [];
const MyRetryAgent = new RetryAgent('TSCC connect');
const MyKeepAliveAgent = new KeepAliveAgent();

export const TeenSpotChatClient = {
   // Don't use arrow function here, cuz we need to access this.
   connect: async function (options: TeenSpotChatClientOptions) {
      const self = this; // oof.
      console.log("connect self", this);
      config = options;
      const { apollo_client, dispatch } = options

      // Get user token for authentication with WebSocket server
      const identity_token = await getIdentityToken();
      const url_with_token = `${getWebsocketEndpoint()}${identity_token}`
      console.log(url_with_token)

      // Check current state of webSocket
      console.log("TSClient.connect ws.readyState", ws && ws.readyState);

      if (ws) {
         // Reset queue to prevent previous connection's
         // queued requests from running.
         request_queue = [];
      }

      console.log("Making GQL request from ws client!!", reconnect_on_close)
      const gql_request_options: QueryOptions = {
         query: GET_CHAT_DATA_QUERY,
      }
      const chat_data = await apollo_client.query(gql_request_options)
      console.log("CHAT_DATA", chat_data);

      // At this point, we have the user's chat preferences.
      // Specifically, which room they want to join first.
      // We will join that room client-side now.
      const rooms_to_join = getRoomsToJoin(options, chat_data);
      await dispatch(joinRooms({
         thread_ids: rooms_to_join.rooms_to_join,
         current_room: rooms_to_join.current_room,
      }))

      // Need to sort users_online by power level.
      sortUsersOnlineApollo(options, rooms_to_join.current_room);

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
      clearUnneededMessageHistory(options, rooms_to_join)

      // Hopefully, the store is updated by now, so
      // when we call writeConnectingMessage below,
      // the message gets written to the room...

      MyRetryAgent.onConnectAttempt()

      reconnect_on_close = true;
      console.log("Connecting to WebSocket:")
      writeConnectingMessage(options)
      // ws = {}
      ws = new WebSocket(url_with_token)

      ws.onopen = () => {
         console.log('WS: connected!')
         // All successful connects reset the
         // connect count!
         MyRetryAgent.onConnected();
         writeConnectionEstablishedMessage(options);

         MyKeepAliveAgent.onConnected(
            ws,
            () => ws.send(JSON.stringify({ action: 'keepalive' }))
         );

         // Need to join rooms!
         if (!!chat_data.data) {
            console.log("TSClient: WS join room");
            self.joinRooms(rooms_to_join.rooms_to_join);
         }

         // There's a 'Welcome to TS' message
         // that I have to move from pre chat_data storage
         // to post chat_data storage.
         moveInitialWelcomeMessage(options);

         // Go through the request queue
         while (request_queue.length > 0) {
            const ws_message = request_queue.shift()
            console.log("Sending queued ws message:", ws_message)
            ws.send(JSON.stringify(ws_message))
         }
      }

      ws.onclose = () => {
         console.log('WS: diconnected')
         let reconnect_delay
         console.log("ws.onClose: readyState", ws && ws.readyState)
         if (ws && ws.readyState !== ws.CLOSED) {
            // Consider this:
            // If readyState is OPEN and we attempt to reconnect, 2 connections will be opened = bad.
            // Same with CONNECTING.
            // If CLOSING, this method is about to be called again,
            // possibly leading to 2 connections being opened, which is bad.
         }
         else if (reconnect_on_close) {
            MyRetryAgent.retry(
               function () { self.connect(options) },
               undefined,
               ({ delay }) => { reconnect_delay = delay/1000 }
            )
         }

         writeDisconnectedMessage(options, reconnect_delay);

         // Clear keepalive interval.
         MyKeepAliveAgent.onDisconnected(ws)

         // Maybe it's a good idea to reset request queue here
         request_queue = [];
      }

      // Runs when we receive a message from the server.
      ws.onmessage = event => {
         // console.debug("WebSocket message received:", event);
         const tools = { apollo_client }
         const data = parseWebSocketMessage(event)

         switch (data.action) {
            // We receive a chat message from the server
            case 'send':
               onSend(tools, data.payload);
               break
            case 'joinrooms':
               onJoinRooms(tools, data.payload);
               break
            case 'leaverooms':
            case 'quit':
               onLeaveRoomsMessage(tools, data);
               break
            default:
               return
         }
      }

   },

   disconnect: () => {
      if (ws && ws.close) {
         writeDisconnectingMessage(config);
         // We are disconnecting on purpose, so
         // don't try to reconnect when connection is closed.
         // Comment this out to test auto-reconnecting.
         reconnect_on_close = false

         MyKeepAliveAgent.onDisconnectAttempt();

         ws.close()
      }
      else {
         console.log('no ws')
      }
   },

   joinRooms: (thread_ids) => {
      const ws_message = {
         action: 'joinrooms',
         payload: {
            thread_ids,
         }
      }

      if (!ws || ws.readyState !== ws.OPEN) {
         // queue the request
         console.log("Queuing join request!")
         request_queue.push(ws_message);
      }
      else if (ws.readyState === ws.OPEN) {
         console.log("Sending join request")

         if (NODE_ENV !== 'production' && USE_LOCAL_WS_LAMBDA) {
            // If I'm using local WS lambda,
            // There will be race conditions if I
            // don't delay this message...
            setTimeout(() => {
               ws.send(JSON.stringify(ws_message));
            }, 2000)
         }
         else {
            ws.send(JSON.stringify(ws_message));
         }
      }
   },

   leaveRooms: (thread_ids) => {
      const ws_message = {
         action: 'leaverooms',
         payload: {
            thread_ids,
         }
      }

      ws.send(JSON.stringify(ws_message));
   },

   sendChatMessage: (content: string) => {
      if (!ws) {
         console.log("sendChatMessage: no websocket connection")
         return;
      }

      const cleaned_content = content.trim();

      if (!cleaned_content) {
         // Don't send empty messages;
         return;
      }

      if (config) {
         const { getState } = config

         const { chat: chat_state } = getState();

         if (chat_state.current_room) {
            const request = {
               action: 'send',
               payload: {
                  content: cleaned_content,
                  thread_id: chat_state.current_room,
               }
            }

            ws.send(JSON.stringify(request));
         }
      }
   }
}