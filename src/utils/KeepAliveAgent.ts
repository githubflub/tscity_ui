// Attach the following methods to your process...
//    onDisconnectAttempt
//    onDisconnected
//    onConnected

export class KeepAliveAgent {
   private keep_alive_interval;
   private keep_alive_time_interval = 8 * 60 * 1000 // 8 minutes

   clearKeepAliveInterval() {
      this.keep_alive_interval = clearInterval(this.keep_alive_interval);
   }

   onDisconnectAttempt() {
      this.clearKeepAliveInterval();
   }

   onDisconnected(ws: WebSocket) {
      // Clear keepalive interval.
      if (ws && ws.readyState !== ws.CLOSED) {}
      else {
         this.clearKeepAliveInterval();
      }
   }

   onConnected(ws: WebSocket, func: Function) {
      this.clearKeepAliveInterval();
      this.keep_alive_interval = window.setInterval(() => {
         if (ws && ws.readyState === ws.OPEN) {
            func();
         }
         else {
            // ws not open anymore. Clear interval.
            this.clearKeepAliveInterval();
         }
      }, this.keep_alive_time_interval);
   }
}