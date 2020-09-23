import { getIdentityToken } from 'amplify/getIdentityToken';
import { getWebsocketEndpoint, USE_LOCAL_WS_LAMBDA } from 'utils/getEndpoint'
import { RetryAgent } from 'utils/RetryAgent'
import { KeepAliveAgent } from 'utils/KeepAliveAgent'

export class WebSocketClient {
   public ws: WebSocket;
   public request_queue = [];
   private RetryAgent = new RetryAgent('TSCC connect');
   private KeepAliveAgent = new KeepAliveAgent();
   private reconnect_on_close = true;
   private connection_established_timestamp;

   // Extend this class and override these!
   onOpen() {}
   onClose({ reconnect_delay }) {}
   onMessage(event: MessageEvent) {}
   async onConnectAttempt() {}
   onDisconnectAttempt() {}

   async connect() {
      await this.onConnectAttempt();

      // Get user token for authentication with WebSocket server
      const identity_token = await getIdentityToken();
      const url_with_token = `${getWebsocketEndpoint()}${identity_token}`
      // console.log(url_with_token)

      // Check current state of webSocket
      // console.log("TSClient.connect ws.readyState", this.ws && this.ws.readyState);

      if (this.ws) {
         // Reset queue to prevent previous connection's
         // queued requests from running.
         this.request_queue = [];
      }

      this.reconnect_on_close = true;
      this.RetryAgent.onConnectAttempt();
      this.ws = new WebSocket(url_with_token);

      this.ws.onopen = () => {
         // console.log('WS: connected!')
         // All successful connects reset the
         // connect count!
         this.RetryAgent.onConnected();

         this.KeepAliveAgent.onConnected(
            this.ws,
            () => this.ws.send(JSON.stringify({ action: 'keepalive' }))
         );

         this.connection_established_timestamp = Date.now();

         this.onOpen();

         // Go through the request queue
         while (this.request_queue.length > 0) {
            const ws_message = this.request_queue.shift()
            // console.log("Sending queued ws message:", ws_message)
            this.ws.send(JSON.stringify(ws_message))
         }
      }

      this.ws.onclose = () => {
         // console.log('WS: diconnected')
         let reconnect_delay
         // console.log("ws.onClose: readyState", this.ws && this.ws.readyState)
         if (this.ws && this.ws.readyState !== this.ws.CLOSED) {
            // Consider this:
            // If readyState is OPEN and we attempt to reconnect, 2 connections will be opened = bad.
            // Same with CONNECTING.
            // If CLOSING, this method is about to be called again,
            // possibly leading to 2 connections being opened, which is bad.
         }
         else if (this.reconnect_on_close) {
            this.RetryAgent.retry(
               () => this.connect(),
               undefined,
               ({ delay }) => { reconnect_delay = delay/1000 }
            )
         }

         this.onClose({ reconnect_delay })

         // Clear keepalive interval.
         this.KeepAliveAgent.onDisconnected(this.ws)

         // Maybe it's a good idea to reset request queue here
         this.request_queue = [];
      }

      this.ws.onmessage = this.onMessage.bind(this);
   }

   disconnect() {
      if (this.ws && this.ws.close) {
         this.onDisconnectAttempt();

         // We are disconnecting on purpose, so
         // don't try to reconnect when connection is closed.
         // Comment this out to test auto-reconnecting.
         this.reconnect_on_close = false

         this.KeepAliveAgent.onDisconnectAttempt();
         this.ws.close()
      }
      else {
         // console.log('no ws')
      }
   }

   getTimeSinceConnectionEstablished() {
      const result = Date.now() - this.connection_established_timestamp;
      return result;
   }

   hasBeenLongEnoughSinceConnectionEstablished() {
      const elapsed_time = this.getTimeSinceConnectionEstablished();
      if (elapsed_time >= 1000) {
         return true;
      }

      return false;
   }

   sendMessage(ws_message) {
      if (!this.ws) {
         // console.log("sendMessage: no websocket connection")
         return;
      }
      else if (this.ws.readyState !== this.ws.OPEN) {
         // Queue the request.
         // console.log("Queuing the request", ws_message);
         this.request_queue.push(ws_message);
      }
      else if (this.ws.readyState === this.ws.OPEN) {
         // console.log("Sending message", ws_message);

         if (
            NODE_ENV !== 'production'
            && USE_LOCAL_WS_LAMBDA
            && !this.hasBeenLongEnoughSinceConnectionEstablished()
         ) {
            // If I'm using local WS lambda,
            // There will be race conditions if I
            // don't delay this message...
            setTimeout(() => {
               this.ws.send(JSON.stringify(ws_message));
            }, 2000)
         }
         else {
            this.ws.send(JSON.stringify(ws_message));
         }
      }
   }
}