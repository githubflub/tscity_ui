import { writeSystemMessage } from './writeSystemMessage'

export function writeDisconnectedMessage(options, reconnect_delay) {
   const message = reconnect_delay? `Disconnected. Reconnecting in ${reconnect_delay}s...` : `Disconnected`;

   writeSystemMessage(message, options);
}