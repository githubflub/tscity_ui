type WSMessageType = {
   action?: string;
   payload?: object;
}

export function parseWebSocketMessage(event): WSMessageType {
   let data = {}

   try {
      data = JSON.parse(event.data)
   }
   catch (error) {
      console.log("WebSocket Message Parse Error:", error)
   }

   return data;
}