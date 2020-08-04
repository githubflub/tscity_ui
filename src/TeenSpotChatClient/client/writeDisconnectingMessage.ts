import { writeSystemMessage } from './writeSystemMessage'

export function writeDisconnectingMessage(options) {
   writeSystemMessage(`Disconnecting...`, options)
}