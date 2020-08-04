import { writeSystemMessage } from './writeSystemMessage'

export function writeConnectingMessage(options) {
   const { getState } = options;
   const { session } = getState();

   const message = session.is_authenticated?
      `Connecting as ${session.identity['cognito:username']} to ${location.host}...`
      : `Connecting to ${location.host}...`;

   writeSystemMessage(message, options);
}