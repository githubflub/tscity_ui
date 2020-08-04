import { writeSystemMessage } from './writeSystemMessage'

export function writeConnectionEstablishedMessage(options) {
   writeSystemMessage(`Connection established!`, options)
}